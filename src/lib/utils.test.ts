import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { ZodError, z } from 'zod'
import { generateToken, errorHandler } from './utils.ts'

describe('generateToken', () => {
    it('signs a token containing the userId and role', () => {
        const token = generateToken('user-1', 'TEACHER')
        const decoded = jwt.decode(token) as { userId: string, role: string }

        expect(decoded.userId).toBe('user-1')
        expect(decoded.role).toBe('TEACHER')
    })
})

describe('errorHandler', () => {
    const makeRes = () => {
        const res: any = {}
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)
        return res
    }

    it('responds 400 with the first Zod issue message for a ZodError', () => {
        const res = makeRes()
        const schema = z.object({ email: z.string().email() })
        let zodError: ZodError

        try {
            schema.parse({ email: 'not-an-email' })
            throw new Error('expected schema.parse to throw')
        } catch (e) {
            zodError = e as ZodError
        }

        errorHandler(res, zodError)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: zodError.issues[0].message,
        })
    })

    it('responds 400 with the error message for a plain Error', () => {
        const res = makeRes()

        errorHandler(res, new Error('Something went wrong'))

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Something went wrong',
        })
    })

    it('responds 500 for a non-Error value', () => {
        const res = makeRes()

        errorHandler(res, 'not an error object')

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error',
        })
    })
})
