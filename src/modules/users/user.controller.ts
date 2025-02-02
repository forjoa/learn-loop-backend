import { Request, Response } from 'express'
import { editUserSchema } from './user.model'
import { editUser } from './user.service'
import { errorHandler } from '../../lib/utils'

export const handleEditUser = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = editUserSchema.parse(req.body)

        // call service to create user
        const user = await editUser(validateData)

        return res.status(200).json({
            message: 'User updated successfully',
            data: user
        })
    } catch (error) {
        errorHandler(res, error)
    }
}