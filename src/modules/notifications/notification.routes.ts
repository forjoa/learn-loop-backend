import { Router } from 'express'
import {
    handleCreateNotification,
    handleDeleteNotification,
    handleGetNotifications,
} from './notification.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/create', handleCreateNotification)
// @ts-expect-error
router.get('/get', handleGetNotifications)
// @ts-expect-error
router.delete('/delete', handleDeleteNotification)

export default router
