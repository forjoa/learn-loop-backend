import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateToken } from '../../lib/utils.ts'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        enrollment: { findMany: vi.fn(), deleteMany: vi.fn() },
        message: { deleteMany: vi.fn() },
        chat_member: { deleteMany: vi.fn() },
        chat: { deleteMany: vi.fn() },
        file: { deleteMany: vi.fn() },
        post: { deleteMany: vi.fn() },
        notification: { deleteMany: vi.fn() },
        topic: { deleteMany: vi.fn() },
        user: { delete: vi.fn() },
        $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    },
}))

vi.mock('../../config/db.ts', () => ({
    default: prismaMock,
}))

const httpServer = (await import('../../app.ts')).default
const authHeader = `Bearer ${generateToken('user-1', 'STUDENT')}`

describe('DELETE /users/:id (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        prismaMock.enrollment.findMany.mockResolvedValue([{ id: 'enr-1' }])
    })

    it("returns 403 and deletes nothing when deleting someone else's account", async () => {
        const response = await request(httpServer).delete('/users/user-2').set('Authorization', authHeader)

        expect(response.status).toBe(403)
        expect(prismaMock.$transaction).not.toHaveBeenCalled()
    })

    it("deletes the caller along with the owners' notifications about their enrollments", async () => {
        const response = await request(httpServer).delete('/users/user-1').set('Authorization', authHeader)

        expect(response.status).toBe(200)
        expect(prismaMock.notification.deleteMany).toHaveBeenCalledWith({
            where: { OR: [{ userId: 'user-1' }, { enrollmentId: { in: ['enr-1'] } }] },
        })
        expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 'user-1' } })
    })
})
