import type { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils.ts'
import { getChatByIdSchema, getChatsSchema } from './chat.model.ts'
import { getChatById, getChats } from './chat.service.ts'

export const handleGetChats = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
        const validateData = getChatsSchema.parse({ userId })

        const chats = await getChats(validateData)

        return res.status(200).json(chats)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetChatById = async (req: Request, res: Response) => {
    try {
        const id = req.query.id
        const validateData = getChatByIdSchema.parse({ id })

        const chat = await getChatById(validateData)
        if (!chat) {
            return res.status(404).json({ message: 'Chat no encontrado' })
        }

        return res.status(200).json(chat)
    } catch (error) {
        errorHandler(res, error)
    }
}
