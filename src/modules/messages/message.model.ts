import { z } from 'zod'

export const createMessageSchema = z.object({
    content: z.string().min(1, 'Message shouldn\'t be empty'),
    senderId: z.number(),
    chatId: z.number()
})

export type CreateMessageSchema = z.infer<typeof createMessageSchema>

export const getMessagesSchema = z.object({chatId: z.number()})

export type GetMessagesSchema = z.infer<typeof getMessagesSchema>