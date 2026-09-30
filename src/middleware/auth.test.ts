import { describe, expect, it, vi } from 'vitest'
import { generateToken } from '../lib/utils.ts'
import { auth } from './auth.ts'

const makeRes = () => {
    const res: any = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

describe('auth middleware', () => {
    it('rejects a request with no Authorization header', () => {
        const req: any = { headers: {} }
        const res = makeRes()
        const next = vi.fn()

        auth(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
        expect(next).not.toHaveBeenCalled()
    })

    it('rejects a request with an invalid token', () => {
        const req: any = { headers: { authorization: 'Bearer not-a-real-token' } }
        const res = makeRes()
        const next = vi.fn()

        auth(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })

    it('calls next() and attaches the decoded user for a valid token', () => {
        const token = generateToken('user-1', 'STUDENT')
        const req: any = { headers: { authorization: `Bearer ${token}` } }
        const res = makeRes()
        const next = vi.fn()

        auth(req, res, next)

        expect(next).toHaveBeenCalledOnce()
        expect(res.status).not.toHaveBeenCalled()
        expect(req.user).toMatchObject({ userId: 'user-1', role: 'STUDENT' })
    })
})
