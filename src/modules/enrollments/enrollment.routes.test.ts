import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateToken } from '../../lib/utils.ts'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        topic: {
            findUnique: vi.fn(),
        },
        user: {
            findUnique: vi.fn(),
        },
        enrollment: {
            findFirst: vi.fn(),
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
        notification: {
            create: vi.fn(),
            deleteMany: vi.fn(),
        },
        chat: {
            findFirst: vi.fn(),
        },
        chat_member: {
            upsert: vi.fn(),
        },
    },
}))

vi.mock('../../config/db.ts', () => ({
    default: prismaMock,
}))

const httpServer = (await import('../../app.ts')).default
const authHeader = `Bearer ${generateToken('student-1', 'STUDENT')}`

describe('POST /enrollments (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        prismaMock.topic.findUnique.mockResolvedValue({ ownerId: 'owner-1', title: 'Algebra' })
        prismaMock.user.findUnique.mockResolvedValue({ name: 'Student One' })
    })

    it('creates a new enrollment and notifies the owner when none exists yet', async () => {
        prismaMock.enrollment.findFirst.mockResolvedValue(null)
        prismaMock.enrollment.create.mockResolvedValue({
            id: 'enr-1',
            userId: 'student-1',
            topicId: 'topic-1',
            status: 'PENDING',
        })

        const response = await request(httpServer)
            .post('/enrollments')
            .set('Authorization', authHeader)
            .send({ userId: 'student-1', topicId: 'topic-1' })

        expect(response.status).toBe(200)
        expect(prismaMock.enrollment.create).toHaveBeenCalledOnce()
        expect(prismaMock.notification.create).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ userId: 'owner-1', enrollmentId: 'enr-1' }) }),
        )
    })

    it('does not create a duplicate row when a PENDING request already exists', async () => {
        prismaMock.enrollment.findFirst.mockResolvedValue({ id: 'enr-1', status: 'PENDING' })

        const response = await request(httpServer)
            .post('/enrollments')
            .set('Authorization', authHeader)
            .send({ userId: 'student-1', topicId: 'topic-1' })

        expect(response.status).toBe(200)
        expect(prismaMock.enrollment.create).not.toHaveBeenCalled()
        expect(prismaMock.notification.create).not.toHaveBeenCalled()
    })

    it('does not create a duplicate row when already APPROVED', async () => {
        prismaMock.enrollment.findFirst.mockResolvedValue({ id: 'enr-1', status: 'APPROVED' })

        const response = await request(httpServer)
            .post('/enrollments')
            .set('Authorization', authHeader)
            .send({ userId: 'student-1', topicId: 'topic-1' })

        expect(response.status).toBe(200)
        expect(prismaMock.enrollment.create).not.toHaveBeenCalled()
        expect(prismaMock.enrollment.update).not.toHaveBeenCalled()
    })

    it('flips a REJECTED enrollment back to PENDING instead of creating a new row', async () => {
        prismaMock.enrollment.findFirst.mockResolvedValue({ id: 'enr-1', status: 'REJECTED' })
        prismaMock.enrollment.update.mockResolvedValue({ id: 'enr-1', status: 'PENDING' })

        const response = await request(httpServer)
            .post('/enrollments')
            .set('Authorization', authHeader)
            .send({ userId: 'student-1', topicId: 'topic-1' })

        expect(response.status).toBe(200)
        expect(prismaMock.enrollment.create).not.toHaveBeenCalled()
        expect(prismaMock.enrollment.update).toHaveBeenCalledWith({
            where: { id: 'enr-1' },
            data: { status: 'PENDING' },
        })
    })
})

describe('GET /enrollments?userId=&topicId= (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns the current enrollment status for a user/topic pair', async () => {
        prismaMock.enrollment.findFirst.mockResolvedValue({ id: 'enr-1', status: 'PENDING' })

        const response = await request(httpServer)
            .get('/enrollments?userId=student-1&topicId=topic-1')
            .set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ id: 'enr-1', status: 'PENDING' })
    })

    it('returns null when the user never requested to join', async () => {
        prismaMock.enrollment.findFirst.mockResolvedValue(null)

        const response = await request(httpServer)
            .get('/enrollments?userId=student-1&topicId=topic-1')
            .set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(response.body).toBeNull()
    })
})

describe('GET /topics/:topicId/enrollments (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns pending enrollments for a topic', async () => {
        prismaMock.enrollment.findMany.mockResolvedValue([
            { id: 'enr-1', user: { id: 'student-1', name: 'Student One', email: 's@x.com', photo: 'ant.png' } },
        ])

        const response = await request(httpServer).get('/topics/topic-1/enrollments').set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(prismaMock.enrollment.findMany).toHaveBeenCalledWith({
            where: { topicId: 'topic-1', status: 'PENDING' },
            select: { id: true, user: { select: { id: true, name: true, email: true, photo: true } } },
        })
    })
})

describe('PATCH /enrollments/:id (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('accepts an enrollment and creates the chat membership when status is APPROVED', async () => {
        prismaMock.enrollment.update.mockResolvedValue({
            id: 'enr-1',
            userId: 'student-1',
            topicId: 'topic-1',
            status: 'APPROVED',
            topic: { title: 'Algebra' },
        })
        prismaMock.chat.findFirst.mockResolvedValue({ id: 'chat-1', topicId: 'topic-1' })

        const response = await request(httpServer)
            .patch('/enrollments/enr-1')
            .set('Authorization', authHeader)
            .send({ status: 'APPROVED' })

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Enrollment accepted successfully')
        expect(prismaMock.enrollment.update).toHaveBeenCalledWith({
            where: { id: 'enr-1' },
            data: { id: 'enr-1', status: 'APPROVED' },
            include: { topic: { select: { title: true } } },
        })
        expect(prismaMock.chat_member.upsert).toHaveBeenCalledWith({
            where: { chatId_userId: { userId: 'student-1', chatId: 'chat-1' } },
            create: { userId: 'student-1', chatId: 'chat-1' },
            update: {},
        })
        expect(prismaMock.notification.create).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ title: 'Solicitud aceptada' }) }),
        )
    })

    it('denies an enrollment without creating a chat membership when status is REJECTED', async () => {
        prismaMock.enrollment.update.mockResolvedValue({
            id: 'enr-1',
            userId: 'student-1',
            topicId: 'topic-1',
            status: 'REJECTED',
            topic: { title: 'Algebra' },
        })

        const response = await request(httpServer)
            .patch('/enrollments/enr-1')
            .set('Authorization', authHeader)
            .send({ status: 'REJECTED' })

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Enrollment denied successfully')
        expect(prismaMock.chat_member.upsert).not.toHaveBeenCalled()
        expect(prismaMock.notification.create).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ title: 'Solicitud rechazada' }) }),
        )
    })

    it('rejects an unsupported status with a 400 before touching the database', async () => {
        const response = await request(httpServer)
            .patch('/enrollments/enr-1')
            .set('Authorization', authHeader)
            .send({ status: 'PENDING' })

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(prismaMock.enrollment.update).not.toHaveBeenCalled()
    })
})
