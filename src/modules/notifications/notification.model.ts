import { z } from 'zod'

export const createNotificationSchema = z.object({
    userId: z.number(),
    title: z.string().min(1, 'Notification title shouln\'t be empty'),
    content: z.string().min(1, 'Notification content shouln\'t be empty')
})

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>

export const getNotificationsSchema = z.object({
    userId: z.number()
})

export type GetNotificationsSchema = z.infer<typeof getNotificationsSchema>

export const deleteNotificationSchema = z.object({
    id: z.number()
})

export type DeleteNotificationSchema = z.infer<typeof deleteNotificationSchema>