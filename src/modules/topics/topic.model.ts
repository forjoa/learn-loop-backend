import { z } from 'zod'

export const createTopicSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    ownerId: z.number()
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>

export const getAllTopicsByOwnerSchema = z.object({
    ownerId: z.number()
})

export type GetAllTopicsByOwner = z.infer<typeof getAllTopicsByOwnerSchema>

export const getAllTopicsByUserSchema = z.object({
    userId: z.number()
})

export type GetAllTopicsByUser = z.infer<typeof getAllTopicsByUserSchema>

export const deleteTopicSchema = z.object({
    id: z.number()
})

export type DeleteTopic = z.infer<typeof deleteTopicSchema>