import { Server } from 'socket.io'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateToken } from '../../lib/utils.ts'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        chat_member: {
            findUnique: vi.fn(),
        },
        message: {
            create: vi.fn(),
            findMany: vi.fn(),
        },
    },
}))

vi.mock('../../config/db.ts', () => ({
    default: prismaMock,
}))

const httpServer = (await import('../../app.ts')).default
const authHeader = `Bearer ${generateToken('student-1', 'STUDENT')}`

describe('/chats/:chatId/messages (protected route)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        prismaMock.chat_member.findUnique.mockResolvedValue({ id: 'member-1' })
    })

    it('returns 403 to someone who is not a member of the chat', async () => {
        prismaMock.chat_member.findUnique.mockResolvedValue(null)

        const response = await request(httpServer).get('/chats/chat-1/messages').set('Authorization', authHeader)

        expect(response.status).toBe(403)
        expect(prismaMock.chat_member.findUnique).toHaveBeenCalledWith({
            where: { chatId_userId: { chatId: 'chat-1', userId: 'student-1' } },
            select: { id: true },
        })
        expect(prismaMock.message.findMany).not.toHaveBeenCalled()
    })

    it('sends as the caller from the token, ignoring any senderId in the body', async () => {
        prismaMock.message.create.mockResolvedValue({ id: 'msg-1' })
        const emit = vi.fn()
        const to = vi.spyOn(Server.prototype, 'to').mockReturnValue({ emit } as never)

        const response = await request(httpServer)
            .post('/chats/chat-1/messages')
            .set('Authorization', authHeader)
            .send({ content: 'hola', senderId: 'someone-else' })

        expect(response.status).toBe(200)
        expect(prismaMock.message.create).toHaveBeenCalledWith(
            expect.objectContaining({ data: { chatId: 'chat-1', senderId: 'student-1', content: 'hola' } }),
        )
        // the saved message is pushed to the chat room by the server, not relayed from the client
        expect(to).toHaveBeenCalledWith('chat-1')
        expect(emit).toHaveBeenCalledWith('chatMessage', { id: 'msg-1' })
    })
})
