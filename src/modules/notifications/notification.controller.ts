import type { Request, Response } from 'express'
import { assertNotificationOwner, assertSelf } from '../../lib/access.ts'
import { errorHandler } from '../../lib/utils.ts'
import { deleteNotificationSchema, getNotificationsSchema } from './notification.model.ts'
import { deleteNotification, getNofitications } from './notification.service.ts'

export const handleGetNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        // validate request body with zod
        const validateData = getNotificationsSchema.parse({ userId })
        assertSelf(validateData.userId, req.user.userId)

        // call service to get a notification
        const notifications = await getNofitications(validateData)

        return res.status(200).json(notifications)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleDeleteNotification = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        // validate request body with zod
        const validateData = deleteNotificationSchema.parse({ id })
        await assertNotificationOwner(validateData.id, req.user.userId)

        // call service to delete a notification
        const notification = await deleteNotification(validateData)

        return res.status(200).json({
            message: 'Notification deleted correctly',
            data: notification,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}
