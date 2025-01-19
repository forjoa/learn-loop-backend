import { Router } from 'express'
import { handleCreateNotification, handleDeleteNotification, handleGetNotifications } from './notification.controller'

const router = Router()

// @ts-ignore
router.post('/create', handleCreateNotification)
// @ts-ignore
router.get('/get', handleGetNotifications)
// @ts-ignore
router.delete('/delete', handleDeleteNotification)

export default router