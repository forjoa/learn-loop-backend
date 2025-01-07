import {Request, Response} from "express";
import {createTopicSchema} from "./topic.model";
import {createTopic} from "./topic.service";

export const handleCreateTopic = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createTopicSchema.parse(req.body);

        // call service to create user
        const topic = await createTopic(validateData);

        return res.status(201).json({
            message: 'Topic created successfully',
            data: topic
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