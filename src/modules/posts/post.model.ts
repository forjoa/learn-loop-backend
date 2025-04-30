import { z } from 'zod'

export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    content: z.string().min(1, 'Content is required'),
    userId: z.number(),
    topicId: z.number()
})

export type CreatePost = z.infer<typeof createPostSchema>