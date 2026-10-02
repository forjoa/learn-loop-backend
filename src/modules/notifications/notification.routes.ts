import { Router } from 'express'
import {
    handleCreateNotification,
    handleDeleteNotification,
    handleGetNotifications,
} from './notification.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/', handleCreateNotification)
// @ts-expect-error
router.delete('/:id', handleDeleteNotification)

export default router

// GET /users/:userId/notifications - mounted by the users router
export const userNotificationRouter = Router({ mergeParams: true })

// @ts-expect-error
userNotificationRouter.get('/', handleGetNotifications)
