import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { generateToken } from '../../lib/utils.ts'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        topic: {
            create: vi.fn(),
            findMany: vi.fn(),
        },
        chat: {
            create: vi.fn(),
        },
        chat_member: {
            create: vi.fn(),
        },
    },
}))

vi.mock('../../config/db.ts', () => ({
    default: prismaMock,
}))

const httpServer = (await import('../../app.ts')).default
const authHeader = `Bearer ${generateToken('owner-1', 'TEACHER')}`

describe('POST /topics (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects requests with no Authorization header', async () => {
        const response = await request(httpServer)
            .post('/topics')
            .send({ title: 'Algebra', description: 'Intro to algebra', ownerId: 'owner-1' })

        expect(response.status).toBe(401)
        expect(prismaMock.topic.create).not.toHaveBeenCalled()
    })

    it('creates a topic, its chat and chat membership for a valid request', async () => {
        prismaMock.topic.create.mockResolvedValue({ id: 'topic-1', title: 'Algebra', description: 'Intro to algebra', ownerId: 'owner-1' })
        prismaMock.chat.create.mockResolvedValue({ id: 'chat-1', topicId: 'topic-1' })
        prismaMock.chat_member.create.mockResolvedValue({ userId: 'owner-1', chatId: 'chat-1' })

        const response = await request(httpServer)
            .post('/topics')
            .set('Authorization', authHeader)
            .send({ title: 'Algebra', description: 'Intro to algebra', ownerId: 'owner-1' })

        expect(response.status).toBe(201)
        expect(response.body.data).toMatchObject({ id: 'topic-1', title: 'Algebra' })
        expect(prismaMock.topic.create).toHaveBeenCalledWith({
            data: { title: 'Algebra', description: 'Intro to algebra', ownerId: 'owner-1' },
        })
        expect(prismaMock.chat.create).toHaveBeenCalledWith({ data: { topicId: 'topic-1' } })
        expect(prismaMock.chat_member.create).toHaveBeenCalledWith({
            data: { userId: 'owner-1', chatId: 'chat-1' },
        })
    })

    it('rejects a missing title with a 400 before touching the database', async () => {
        const response = await request(httpServer)
            .post('/topics')
            .set('Authorization', authHeader)
            .send({ description: 'Intro to algebra', ownerId: 'owner-1' })

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(prismaMock.topic.create).not.toHaveBeenCalled()
    })
})

describe('GET /topics (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns all topics for an authenticated request', async () => {
        prismaMock.topic.findMany.mockResolvedValue([{ id: 'topic-1', title: 'Algebra' }])

        const response = await request(httpServer)
            .get('/topics')
            .set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(response.body).toEqual([{ id: 'topic-1', title: 'Algebra' }])
    })
})
