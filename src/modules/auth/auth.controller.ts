import { Request, Response } from 'express'
import { createUserSchema, loginUserSchema } from '../users/user.model'
import { createUser, loginUser, validateToken } from './auth.service'
import { errorHandler } from '../../lib/utils'

export const handleCreateUser = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createUserSchema.parse(req.body)

        // call service to create user
        const user = await createUser(validateData)

        return res.status(201).json({
            message: 'User created successfully',
            data: user
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleLogin = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const input = loginUserSchema.parse(req.body)

        // call service to create user
        const user = await loginUser(input)

        res.status(200).json(user)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleValidateToken = async (req: Request, res: Response) => {
    try {
        // get token from request parameters
        const { token } = req.params

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            })
        }

        // validate token and get user info
        const result = await validateToken(token)

        if (result.exists) {
            return res.status(200).json({
                success: true,
                data: result
            })
        } else {
            return res.status(401).json({
                success: false,
                message: result.error
            })
        }
    } catch (error) {
        errorHandler(res, error)
    }
}
