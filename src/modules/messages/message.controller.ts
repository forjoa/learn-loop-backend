import {Request, Response} from "express";
import {createMessageSchema} from "./message.model";
import {createMessage} from "./message.service";

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
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}