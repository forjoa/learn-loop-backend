import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateToken } from './lib/utils.ts'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        chat_member: {
            findUnique: vi.fn(),
        },
    },
}))

vi.mock('./config/db.ts', () => ({
    default: prismaMock,
}))

const { authenticateSocket, default: socketHandler } = await import('./socket.ts')

const makeSocket = (token?: string) => {
    const handlers: Record<string, (...args: any[]) => Promise<void>> = {}
    return {
        handshake: { auth: { token } },
        data: {} as { userId?: string },
        join: vi.fn(),
        on: (event: string, handler: (...args: any[]) => Promise<void>) => {
            handlers[event] = handler
        },
        handlers,
    }
}

const connect = (socket: ReturnType<typeof makeSocket>) => {
    const io: any = { use: vi.fn(), on: (_event: string, onConnection: (s: unknown) => void) => onConnection(socket) }
    socketHandler(io)
}

describe('socket auth', () => {
    it('rejects a connection without a valid token', () => {
        const next = vi.fn()

        authenticateSocket(makeSocket('not-a-token') as any, next)

        expect(next).toHaveBeenCalledWith(expect.any(Error))
    })

    it('accepts a valid token and remembers the user', () => {
        const socket = makeSocket(generateToken('student-1', 'STUDENT'))
        const next = vi.fn()

        authenticateSocket(socket as any, next)

        expect(next).toHaveBeenCalledWith()
        expect(socket.data.userId).toBe('student-1')
    })
})

describe('joinRoom', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('joins the room when the user is a member of the chat', async () => {
        prismaMock.chat_member.findUnique.mockResolvedValue({ id: 'member-1' })
        const socket = makeSocket()
        socket.data.userId = 'student-1'
        connect(socket)

        await socket.handlers.joinRoom('chat-1')

        expect(socket.join).toHaveBeenCalledWith('chat-1')
    })

    it('stays out of the room when the user is not a member', async () => {
        prismaMock.chat_member.findUnique.mockResolvedValue(null)
        const socket = makeSocket()
        socket.data.userId = 'intruder'
        connect(socket)

        await socket.handlers.joinRoom('chat-1')

        expect(socket.join).not.toHaveBeenCalled()
    })
})
