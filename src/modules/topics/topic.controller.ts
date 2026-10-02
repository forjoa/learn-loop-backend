import type { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils.ts'
import {
    createTopicSchema,
    deleteTopicSchema,
    editTopicSchema,
    getAllTopicsByOwnerSchema,
    getAllTopicsByUserSchema,
    getTopicSchema,
} from './topic.model.ts'
import {
    createTopic,
    deleteTopic,
    editTopic,
    getAllTopics,
    getAllTopicsByOwner,
    getAllTopicsByUser,
    getTopicById,
    getTopicPreview,
} from './topic.service.ts'

export const handleCreateTopic = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createTopicSchema.parse(req.body)

        // call service to create a topic
        const topic = await createTopic(validateData)

        return res.status(201).json({
            message: 'Topic created successfully',
            data: topic,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetAllTopics = async (req: Request, res: Response) => {
    try {
        const ownerId = req.query.ownerId

        // optional ?ownerId= filter on the topics collection
        if (ownerId !== undefined) {
            // validate the query param using zod
            const validateData = getAllTopicsByOwnerSchema.parse({ ownerId })

            // call service to get all topics by owner id
            const ownedTopics = await getAllTopicsByOwner(validateData)

            return res.status(201).json(ownedTopics)
        }

        const topics = await getAllTopics()

        return res.status(200).json(topics)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetAllTopicsByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        // validate request body using zod
        const validateData = getAllTopicsByUserSchema.parse({ userId })

        // call service to get all topics by user
        const topics = await getAllTopicsByUser(validateData)

        return res.status(201).json(topics)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleDeleteTopic = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        // validate request body using zod
        const validateData = deleteTopicSchema.parse({ id })

        // call service to delete a topic
        const topic = await deleteTopic(validateData)

        return res.status(201).json({
            message: 'Topic deleted successfully',
            data: topic,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleEditTopic = async (req: Request, res: Response) => {
    try {
        // validate request body using zod, taking the id from the URL path
        const validateData = editTopicSchema.parse({ ...req.body, id: req.params.id })

        // call service to edit a topic
        const topic = await editTopic(validateData)

        return res.status(201).json({
            message: 'Topic edited successfully',
            data: topic,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetTopicById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const validateData = getTopicSchema.parse({ id })

        const topic = await getTopicById(validateData)

        return res.status(201).json(topic)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetTopicPreview = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const validateData = getTopicSchema.parse({ id })

        const preview = await getTopicPreview(validateData)
        if (!preview) {
            return res.status(404).json({ message: 'Tema no encontrado' })
        }

        return res.status(200).json(preview)
    } catch (error) {
        errorHandler(res, error)
    }
}
