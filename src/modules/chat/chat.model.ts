import { z } from 'zod'

export const getChatsSchema = z.object({
    userId: z.number()
})

export type GetChatsSchema = z.infer<typeof getChatsSchema>