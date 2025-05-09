import { z } from 'zod'

export const createFileSchema = z.object({
    url: z.string().min(1, 'URL is required').max(1000, 'URL is too long'),
    filename: z.string(),
    fileType: z.string().max(5, 'Invalid file type'),
    postId: z.number(),
})

export type CreateFile = z.infer<typeof createFileSchema>