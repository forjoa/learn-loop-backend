import {z} from "zod";

export const createChatMemberSchema = z.object({
    chatId: z.number(),
    userId: z.number()
})

export type CreateChatMemberSchema = z.infer<typeof createChatMemberSchema>

export const deleteChatMemberSchema = z.object({
    id: z.number()
})

export type DeleteChatMemberSchema = z.infer<typeof deleteChatMemberSchema>