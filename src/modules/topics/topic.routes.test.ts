import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateToken } from '../../lib/utils.ts'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        topic: {
            create: vi.fn(),
            findMany: vi.fn(),
            delete: vi.fn(),
        },
        chat: {
            create: vi.fn(),
            findMany: vi.fn(),
            deleteMany: vi.fn(),
        },
        chat_member: {
            create: vi.fn(),
            deleteMany: vi.fn(),
        },
        message: {
            deleteMany: vi.fn(),
        },
        post: {
            findMany: vi.fn(),
            deleteMany: vi.fn(),
        },
        file: {
            deleteMany: vi.fn(),
        },
        enrollment: {
            deleteMany: vi.fn(),
        },
        $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
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
        prismaMock.topic.create.mockResolvedValue({
            id: 'topic-1',
            title: 'Algebra',
            description: 'Intro to algebra',
            ownerId: 'owner-1',
        })
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

        const response = await request(httpServer).get('/topics').set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(response.body).toEqual([{ id: 'topic-1', title: 'Algebra' }])
        expect(prismaMock.topic.findMany).toHaveBeenCalledWith()
    })

    it('filters by owner when ?ownerId= is present', async () => {
        prismaMock.topic.findMany.mockResolvedValue([{ id: 'topic-1', title: 'Algebra' }])

        const response = await request(httpServer).get('/topics?ownerId=owner-1').set('Authorization', authHeader)

        expect(response.status).toBe(201)
        expect(response.body).toEqual([{ id: 'topic-1', title: 'Algebra' }])
        expect(prismaMock.topic.findMany).toHaveBeenCalledWith({ where: { ownerId: 'owner-1' } })
    })
})

describe('DELETE /topics/:id (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        prismaMock.$transaction.mockImplementation((operations: Promise<unknown>[]) => Promise.all(operations))
    })

    it('deletes a topic along with its chats, posts, files and enrollments', async () => {
        prismaMock.chat.findMany.mockResolvedValue([{ id: 'chat-1' }])
        prismaMock.post.findMany.mockResolvedValue([{ id: 'post-1' }])
        prismaMock.message.deleteMany.mockResolvedValue({ count: 2 })
        prismaMock.chat_member.deleteMany.mockResolvedValue({ count: 1 })
        prismaMock.chat.deleteMany.mockResolvedValue({ count: 1 })
        prismaMock.file.deleteMany.mockResolvedValue({ count: 1 })
        prismaMock.post.deleteMany.mockResolvedValue({ count: 1 })
        prismaMock.enrollment.deleteMany.mockResolvedValue({ count: 1 })
        prismaMock.topic.delete.mockResolvedValue({ id: 'topic-1', title: 'Algebra' })

        const response = await request(httpServer).delete('/topics/topic-1').set('Authorization', authHeader)

        expect(response.status).toBe(201)
        expect(response.body.data).toEqual({ id: 'topic-1', title: 'Algebra' })
        expect(prismaMock.message.deleteMany).toHaveBeenCalledWith({ where: { chatId: { in: ['chat-1'] } } })
        expect(prismaMock.chat_member.deleteMany).toHaveBeenCalledWith({ where: { chatId: { in: ['chat-1'] } } })
        expect(prismaMock.chat.deleteMany).toHaveBeenCalledWith({ where: { topicId: 'topic-1' } })
        expect(prismaMock.file.deleteMany).toHaveBeenCalledWith({ where: { postId: { in: ['post-1'] } } })
        expect(prismaMock.post.deleteMany).toHaveBeenCalledWith({ where: { topicId: 'topic-1' } })
        expect(prismaMock.enrollment.deleteMany).toHaveBeenCalledWith({ where: { topicId: 'topic-1' } })
        expect(prismaMock.topic.delete).toHaveBeenCalledWith({ where: { id: 'topic-1' } })
    })
})
