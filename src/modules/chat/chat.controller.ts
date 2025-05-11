import { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils'
import { getChatsSchema } from './chat.model'
import { getChats } from './chat.service'

export const handleGetChats = async (req: Request, res: Response) => {
    try {
        const userId = req.query['userId']
        const validateData = getChatsSchema.parse({ userId })

        const chats = await getChats(validateData)

        return res.status(200).json(
            chats
        )
    } catch (error) {
        errorHandler(res, error)
    }
}