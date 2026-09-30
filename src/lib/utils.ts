import jwt from 'jsonwebtoken'
import type { Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env.ts'

export const generateToken = (userId: string, role: string) => {
    const secret = env.SIGNATURE
    const expiresIn = '7d'

    return jwt.sign({userId, role}, secret, {expiresIn})
}

export const errorHandler = (res: Response, error: any) => {
    if (error instanceof ZodError) {
        res.status(400).json({success: false, message: (error as ZodError).issues[0].message})
    } else if (error instanceof Error) {
        res.status(400).json({success: false, message: error.message})
    } else {
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}