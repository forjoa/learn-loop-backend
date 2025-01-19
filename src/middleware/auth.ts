import { NextFunction, Request, Response } from 'express'
import { env } from '../config/env'
import jwt from 'jsonwebtoken'

interface AuthenticateRequest extends Request {
    user?: { userId: number, role: string }
}

export const auth = (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) return res.status(401).json({message: 'Unauthorized'})

    try {
        const secret = env.SIGNATURE
        const payload = jwt.verify(token, secret) as { userId: number, role: string }

        // save user info in request
        req.user = payload

        next()
    } catch (e) {
        return res.status(401).json({message: 'Unauthorized'})
    }
}