import { z } from 'zod'

export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    content: z.string().min(1, 'Content is required'),
    userId: z.string(),
    topicId: z.string(),
    fileUrl: z.string().nullable().optional(),
    filename: z.string().nullable().optional(),
    fileType: z.string().nullable().optional(),
})

export type CreatePost = z.infer<typeof createPostSchema>

export const getSinglePostSchema = z.object({
    id: z.string()
})

export type GetSinglePost = z.infer<typeof getSinglePostSchema>