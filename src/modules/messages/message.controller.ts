import { Request, Response } from 'express'
import { createMessageSchema, getMessagesSchema } from './message.model'
import { createMessage, getMessages } from './message.service'
import { errorHandler } from '../../lib/utils'

export const handleCreateMessage = async (req: Request, res: Response) => {
    try {
        // validate request body with zod
        const validateData = createMessageSchema.parse(req.body)

        // call service to create a message
        const message = await createMessage(validateData)

        return res.status(200).json({
            message: 'Message created successfully',
            data: message
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetMessages = async (req: Request, res: Response) => {
    try {
        const chatId = Number(req.query['chatId'])
        // validate request body with zod
        const validateData = getMessagesSchema.parse({chatId})

        // call service to get all conversation messages
        const messages = await getMessages(validateData)

        return res.status(200).json(
            messages
        )
    } catch (error) {
        errorHandler(res, error)
    }
}