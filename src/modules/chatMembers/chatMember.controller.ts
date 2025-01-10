import {Request, Response} from "express";
import {createChatMemberSchema} from "./chatMember.model";
import {createChatMember} from "./chatMember.service";

export const handleCreateChatMember = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createChatMemberSchema.parse(req.body);

        // call service to create chat member
        const chatMember = await createChatMember(validateData);

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