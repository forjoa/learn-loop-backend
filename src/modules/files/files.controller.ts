import { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils'
import { createFile } from './files.service'
import { createFileSchema } from './files.model'

export const handleCreateFile = async (req: Request, res: Response) => {
    try {
        const body = req.body

        const validateData = createFileSchema.parse(body)

        const file = await createFile(validateData)

        return res.status(201).json({
            message: 'File created successfully',
            data: file
        })
    } catch (error) {
        errorHandler(res, error)
    }
}