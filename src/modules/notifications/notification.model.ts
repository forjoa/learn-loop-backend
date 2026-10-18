import { z } from 'zod'

export const getNotificationsSchema = z.object({
    userId: z.string(),
})

export type GetNotificationsSchema = z.infer<typeof getNotificationsSchema>

export const deleteNotificationSchema = z.object({
    id: z.string(),
})

export type DeleteNotificationSchema = z.infer<typeof deleteNotificationSchema>
