import type { Request, Response } from 'express'
import { assertSelf } from '../../lib/access.ts'
import { errorHandler } from '../../lib/utils.ts'
import { deleteUserSchema, editUserSchema } from './user.model.ts'
import { deleteUser, editUser } from './user.service.ts'

export const handleEditUser = async (req: Request, res: Response) => {
    try {
        // validate request body using zod, taking the id from the URL path
        const validateData = editUserSchema.parse({ ...req.body, id: req.params.id })
        assertSelf(validateData.id, req.user.userId)

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

export const handleDeleteUser = async (req: Request, res: Response) => {
    try {
        const validateData = deleteUserSchema.parse({ id: req.params.id })
        assertSelf(validateData.id, req.user.userId)

        // call service to delete the user and everything that depends on them
        await deleteUser(validateData)

        return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        errorHandler(res, error)
    }
}
