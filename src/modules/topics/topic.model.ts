import {z} from "zod";

export const createTopicSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
    owner_id: z.number()
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>