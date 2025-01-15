import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env'

export const generateToken = (userId: number, role: string) => {
    const secret = env.SIGNATURE
    const expiresIn = '7d'

    return jwt.sign({userId, role}, secret, {expiresIn})
}

export const errorHandler = (res: Response, error: any) => {
    if (error instanceof ZodError) {
        res.status(400).json({success: false, message: (error as ZodError).errors[0].message})
    } else {
        res.status(400).json({success: false, message: (error as Error).message})
    }
}