import {z} from "zod";

export const createChatMemberSchema = z.object({
    chatId: z.number(),
    userId: z.number()
})

export type CreateChatMemberSchema = z.infer<typeof createChatMemberSchema>