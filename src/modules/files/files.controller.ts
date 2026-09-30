import type { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils.ts'
import { createFile } from './files.service.ts'
import { createFileSchema } from './files.model.ts'

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