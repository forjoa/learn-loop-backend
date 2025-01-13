import { Request, Response } from 'express'
import { createNotificationSchema, deleteNotificationSchema, getNotificationsSchema } from './notification.model'
import { createNotification, deleteNotification, getNofitications } from './notification.service'

export const handleCreateNotification = async (req: Request, res: Response) => {
    try {
        // validate request body with zod
        const validateData = createNotificationSchema.parse(req.body)

        // call service to create a notification
        const notification = await createNotification(validateData)

        return res.status(200).json({
            message: 'Notification created successfully',
            data: notification
        })
    } catch (error) {
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}

export const handleGetNotifications = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query['userId'])
        // validate request body with zod
        const validateData = getNotificationsSchema.parse({userId})

        // call service to get a notification
        const notifications = await getNofitications(validateData)

        return res.status(200).json(
            notifications
        )
    } catch (error) {
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}

export const handleDeleteNotification = async (req: Request, res: Response) => {
    try {
        const id = Number(req.query['id'])
        // validate request body with zod
        const validateData = deleteNotificationSchema.parse({id})

        // call service to delete a notification
        const notification = await deleteNotification(validateData)

        return res.status(200).json({
            message: 'Notification deleted correctly',
            data: notification
        })
    } catch (error) {
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}