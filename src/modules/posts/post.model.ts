import { z } from 'zod'

export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    content: z.string().min(1, 'Content is required'),
    userId: z.number(),
    topicId: z.number(),
    fileUrl: z.string(),
    filename: z.string(),
    fileType: z.string(),
})

export type CreatePost = z.infer<typeof createPostSchema>

export const getSinglePostSchema = z.object({
    id: z.number()
})

export type GetSinglePost = z.infer<typeof getSinglePostSchema>