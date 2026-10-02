import type { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils.ts'
import { createChatMemberSchema, deleteChatMemberSchema, getAllMembersSchema } from './chatMember.model.ts'
import { createChatMember, deleteChatMember, getAllMembers } from './chatMember.service.ts'

export const handleCreateChatMember = async (req: Request, res: Response) => {
    try {
        // validate request body using zod, taking the chat id from the URL path
        const validateData = createChatMemberSchema.parse({ ...req.body, chatId: req.params.chatId })

        // call service to create chat member
        const chatMember = await createChatMember(validateData)

        return res.status(201).json({
            message: 'Chat member created successfully',
            data: chatMember,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleDeleteChatMember = async (req: Request, res: Response) => {
    try {
        // validate the chat member id from the URL path using zod
        const validateData = deleteChatMemberSchema.parse({ id: req.params.id })

        // call service to delete a chat member
        const chatMember = await deleteChatMember(validateData)

        return res.status(200).json({
            message: 'Chat member deleted successfully',
            data: chatMember,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetAllMembers = async (req: Request, res: Response) => {
    try {
        const chatId = req.params.chatId
        // validate request body using zod
        const validateData = getAllMembersSchema.parse({ chatId })

        // call service to get all chat members
        const chatMembers = await getAllMembers(validateData)

        return res.status(200).json(chatMembers)
    } catch (error) {
        errorHandler(res, error)
    }
}
