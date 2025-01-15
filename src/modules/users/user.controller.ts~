import { Request, Response } from 'express'
import { editUserSchema } from './user.model'
import { editUser } from './user.service'

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
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}