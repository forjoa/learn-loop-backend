import { z } from 'zod'

export const getChatsSchema = z.object({
    userId: z.string()
})

export type GetChatsSchema = z.infer<typeof getChatsSchema>