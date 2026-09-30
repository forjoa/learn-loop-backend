import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        user: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}))

vi.mock('../../config/db.ts', () => ({
    default: prismaMock,
}))

const httpServer = (await import('../../app.ts')).default

describe('POST /auth/register', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates a user and returns 201 with the created user', async () => {
        prismaMock.user.create.mockResolvedValue({
            id: 'user-1',
            name: 'Ada',
            email: 'ada@example.com',
            photo: '',
            role: 'STUDENT',
        })

        const response = await request(httpServer)
            .post('/auth/register')
            .send({ name: 'Ada', email: 'ada@example.com', password: 'password123' })

        expect(response.status).toBe(201)
        expect(response.body.data).toMatchObject({ email: 'ada@example.com' })
        expect(prismaMock.user.create).toHaveBeenCalledOnce()
    })

    it('rejects an invalid email with a 400 and the shared error envelope', async () => {
        const response = await request(httpServer)
            .post('/auth/register')
            .send({ name: 'Ada', email: 'not-an-email', password: 'password123' })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ success: false })
        expect(prismaMock.user.create).not.toHaveBeenCalled()
    })

    it('rejects a too-short password with a 400', async () => {
        const response = await request(httpServer)
            .post('/auth/register')
            .send({ name: 'Ada', email: 'ada@example.com', password: '123' })

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
    })
})

describe('POST /auth/login', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('logs in with correct credentials and returns a token plus the user', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10)
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user-1',
            email: 'ada@example.com',
            password: hashedPassword,
            name: 'Ada',
            photo: '',
            role: 'STUDENT',
        })

        const response = await request(httpServer)
            .post('/auth/login')
            .send({ email: 'ada@example.com', password: 'password123' })

        expect(response.status).toBe(200)
        expect(response.body.token).toEqual(expect.any(String))
        expect(response.body.user).toMatchObject({ email: 'ada@example.com' })
        expect(response.body.user.password).toBeUndefined()
    })

    it('rejects an unknown email with a 400', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null)

        const response = await request(httpServer)
            .post('/auth/login')
            .send({ email: 'nobody@example.com', password: 'password123' })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ success: false, message: 'User not found' })
    })

    it('rejects the wrong password with a 400', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10)
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user-1',
            email: 'ada@example.com',
            password: hashedPassword,
            name: 'Ada',
            photo: '',
            role: 'STUDENT',
        })

        const response = await request(httpServer)
            .post('/auth/login')
            .send({ email: 'ada@example.com', password: 'wrong-password' })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ success: false, message: 'Invalid password' })
    })
})

describe('GET /auth/me/:token', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 401 for an invalid token', async () => {
        const response = await request(httpServer).get('/auth/me/not-a-real-token')

        expect(response.status).toBe(401)
        expect(response.body.success).toBe(false)
    })
})
