import { z } from 'zod'

export const createChatMemberSchema = z.object({
    chatId: z.string(),
    userId: z.string()
})

export type CreateChatMemberSchema = z.infer<typeof createChatMemberSchema>

export const deleteChatMemberSchema = z.object({
    id: z.string()
})

export type DeleteChatMemberSchema = z.infer<typeof deleteChatMemberSchema>

export const getAllMembersSchema = z.object({
    chatId: z.string()
})

export type GetAllMembers = z.infer<typeof getAllMembersSchema>