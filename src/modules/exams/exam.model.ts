import { z } from 'zod'

export const generateExamSchema = z.object({
    topicId: z.string(),
})

export type GenerateExamSchema = z.infer<typeof generateExamSchema>
