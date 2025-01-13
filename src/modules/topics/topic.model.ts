import { z } from 'zod'

export const createTopicSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    ownerId: z.number()
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>

export const getAllOwnerTopicsSchema = z.object({
    ownerId: z.number()
})

export type GetAllOwnerTopicsSchema = z.infer<typeof getAllOwnerTopicsSchema>