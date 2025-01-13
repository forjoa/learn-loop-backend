import { Request, Response } from 'express'
import { createNotificationSchema } from './notification.model'
import { createNotification } from './notification.service'

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