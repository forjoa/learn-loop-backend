import { Router } from 'express'
import { handleCreateNotification, handleGetNotifications } from './notification.controller'

const router = Router()

// @ts-ignore
router.post('/create', handleCreateNotification)
// @ts-ignore
router.get('/get', handleGetNotifications)

export default router