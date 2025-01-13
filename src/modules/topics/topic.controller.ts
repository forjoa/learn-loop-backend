import { Request, Response } from 'express'
import {
    createTopicSchema,
    deleteTopicSchema,
    getAllTopicsByOwnerSchema,
    getAllTopicsByUserSchema
} from './topic.model'
import { createTopic, deleteTopic, getAllTopicsByOwner, getAllTopicsByUser } from './topic.service'

export const handleCreateTopic = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createTopicSchema.parse(req.body)

        // call service to create a topic
        const topic = await createTopic(validateData)

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

export const handleGetAllTopicsByOwner = async (req: Request, res: Response) => {
    try {
        const ownerId = Number(req.query['ownerId'])
        // validate request body using zod
        const validateData = getAllTopicsByOwnerSchema.parse({ownerId})

        // call service to get all topics by owner id
        const topics = await getAllTopicsByOwner(validateData)

        return res.status(201).json(
            topics
        )
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

export const handleGetAllTopicsByUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query['userId'])
        // validate request body using zod
        const validateData = getAllTopicsByUserSchema.parse({userId})

        // call service to get all topics by user
        const topics = await getAllTopicsByUser(validateData)

        return res.status(201).json(
            topics
        )
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

export const handleDeleteTopic = async (req: Request, res: Response) => {
    try {
        const id = Number(req.query['id'])
        // validate request body using zod
        const validateData = deleteTopicSchema.parse({id})

        // call service to delete a topic
        const topic = await deleteTopic(validateData)

        return res.status(201).json({
            message: 'Topic deleted successfully',
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