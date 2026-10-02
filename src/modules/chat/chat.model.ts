import { z } from 'zod'

export const getChatsSchema = z.object({
    userId: z.string(),
})

export type GetChatsSchema = z.infer<typeof getChatsSchema>

export const getChatByIdSchema = z.object({
    id: z.string(),
})

export type GetChatByIdSchema = z.infer<typeof getChatByIdSchema>
