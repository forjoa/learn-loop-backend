import { z } from 'zod'

export const createTopicSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    ownerId: z.string()
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>

export const getAllTopicsByOwnerSchema = z.object({
    ownerId: z.string()
})

export type GetAllTopicsByOwner = z.infer<typeof getAllTopicsByOwnerSchema>

export const getAllTopicsByUserSchema = z.object({
    userId: z.string()
})

export type GetAllTopicsByUser = z.infer<typeof getAllTopicsByUserSchema>

export const deleteTopicSchema = z.object({
    id: z.string()
})

export type DeleteTopic = z.infer<typeof deleteTopicSchema>

export const editTopicSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    ownerId: z.string()
})

export type EditTopic = z.infer<typeof editTopicSchema>

export const getTopicSchema = z.object({
    id: z.string()
})

export type GetTopic = z.infer<typeof getTopicSchema>