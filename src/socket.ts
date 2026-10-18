import jwt from 'jsonwebtoken'
import type { Server, Socket } from 'socket.io'
import { env } from './config/env.ts'
import { assertChatMember } from './lib/access.ts'

export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const { userId } = jwt.verify(socket.handshake.auth.token, env.SIGNATURE) as { userId: string }
        socket.data.userId = userId
        next()
    } catch {
        next(new Error('Unauthorized'))
    }
}

// Clients only listen: chat messages are emitted by POST /chats/:chatId/messages after they're saved
export default function socketHandler(io: Server) {
    io.use(authenticateSocket)

    io.on('connection', (socket: Socket) => {
        socket.on('joinRoom', async (chatId: string) => {
            try {
                await assertChatMember(chatId, socket.data.userId)
                socket.join(chatId)
            } catch {
                // not a member (or bad chatId): stay out of the room
            }
        })
    })
}
