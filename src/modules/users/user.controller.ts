import type { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils.ts'
import { editUserSchema } from './user.model.ts'
import { editUser } from './user.service.ts'

export const handleEditUser = async (req: Request, res: Response) => {
    try {
        // validate request body using zod, taking the id from the URL path
        const validateData = editUserSchema.parse({ ...req.body, id: req.params.id })

        // call service to create user
        const user = await editUser(validateData)

        return res.status(200).json({
            message: 'User updated successfully',
            data: user,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}
