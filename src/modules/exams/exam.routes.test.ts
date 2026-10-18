import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { generateToken } from '../../lib/utils.ts'

const { prismaMock } = vi.hoisted(() => {
    // env.ts reads this at import time; CI has no real key
    process.env.GEMINI_KEY = 'test-key'
    return {
        prismaMock: {
            topic: {
                findFirst: vi.fn(),
                findUnique: vi.fn(),
            },
        },
    }
})

vi.mock('../../config/db.ts', () => ({
    default: prismaMock,
}))

const httpServer = (await import('../../app.ts')).default
const authHeader = `Bearer ${generateToken('owner-1', 'TEACHER')}`

const PDF_URL = 'https://res.cloudinary.com/demo/image/upload/apuntes.pdf'
const fetchMock = vi.fn()

describe('POST /topics/:topicId/exam (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal('fetch', fetchMock)
        prismaMock.topic.findFirst.mockResolvedValue({ id: 'topic-1' })
        fetchMock.mockImplementation(async (url: string) =>
            url === PDF_URL
                ? new Response(new Uint8Array([37, 80, 68, 70]))
                : Response.json({ candidates: [{ content: { parts: [{ text: '1. ¿Pregunta?' }] } }] }),
        )
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns 403 to anyone but the topic owner, students included', async () => {
        prismaMock.topic.findFirst.mockResolvedValue(null)

        const response = await request(httpServer).post('/topics/topic-1/exam').set('Authorization', authHeader)

        expect(response.status).toBe(403)
        expect(prismaMock.topic.findFirst).toHaveBeenCalledWith({
            where: { id: 'topic-1', ownerId: 'owner-1' },
            select: { id: true },
        })
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('sends the posts and their Cloudinary files to Gemini, but never fetches other URLs', async () => {
        prismaMock.topic.findUnique.mockResolvedValue({
            title: 'Algebra',
            description: 'Intro',
            posts: [
                { title: 'Ecuaciones', content: 'Primer grado', file: [{ url: PDF_URL, fileType: 'PDF' }] },
                { title: 'Interno', content: 'x', file: [{ url: 'http://169.254.169.254/secret', fileType: 'pdf' }] },
            ],
        })

        const response = await request(httpServer).post('/topics/topic-1/exam').set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ output: '1. ¿Pregunta?' })
        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(fetchMock).not.toHaveBeenCalledWith('http://169.254.169.254/secret')

        const geminiBody = JSON.parse(fetchMock.mock.calls[1][1].body)
        const parts = geminiBody.contents[0].parts
        expect(parts).toContainEqual({ text: '## Ecuaciones\nPrimer grado' })
        expect(parts).toContainEqual({ inline_data: { mime_type: 'application/pdf', data: 'JVBERg==' } })
    })

    it('returns 400 when the topic has no posts yet', async () => {
        prismaMock.topic.findUnique.mockResolvedValue({ title: 'Algebra', description: null, posts: [] })

        const response = await request(httpServer).post('/topics/topic-1/exam').set('Authorization', authHeader)

        expect(response.status).toBe(400)
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
