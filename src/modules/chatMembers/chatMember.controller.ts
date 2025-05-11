import { Request, Response } from 'express'
import { createChatMemberSchema, deleteChatMemberSchema, getAllMembersSchema } from './chatMember.model'
import { createChatMember, deleteChatMember, getAllMembers } from './chatMember.service'
import { errorHandler } from '../../lib/utils'

export const handleCreateChatMember = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createChatMemberSchema.parse(req.body)

        // call service to create chat member
        const chatMember = await createChatMember(validateData)

        return res.status(201).json({
            message: 'Chat member created successfully',
            data: chatMember
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleDeleteChatMember = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = deleteChatMemberSchema.parse(req.body)

        // call service to delete a chat member
        const chatMember = await deleteChatMember(validateData)

        return res.status(200).json({
            message: 'Chat member deleted successfully',
            data: chatMember
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetAllMembers = async (req: Request, res: Response) => {
    try {
        const chatId = req.query['chatId']
        // validate request body using zod
        const validateData = getAllMembersSchema.parse({chatId})

        // call service to get all chat members
        const chatMembers = await getAllMembers(validateData)

        return res.status(200).json(
            chatMembers
        )
    } catch (error) {
        errorHandler(res, error)
    }
}