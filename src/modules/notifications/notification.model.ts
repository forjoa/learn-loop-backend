import { z } from 'zod'

export const createNotificationSchema = z.object({
    userId: z.number(),
    title: z.string().min(1, 'Notification title shouln\'t be empty'),
    content: z.string().min(1, 'Notification content shouln\'t be empty')
})

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>