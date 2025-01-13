import { Request, Response } from 'express'
import { createChatMemberSchema, deleteChatMemberSchema } from './chatMember.model'
import { createChatMember, deleteChatMember } from './chatMember.service'

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
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
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
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}