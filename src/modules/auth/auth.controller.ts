import { Request, Response } from 'express'
import { createUserSchema, loginUserSchema } from '../users/user.model'
import { createUser, loginUser } from './auth.service'
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