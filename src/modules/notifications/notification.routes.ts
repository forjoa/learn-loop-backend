import { Router } from 'express'
import { handleCreateNotification } from './notification.controller'

const router = Router()

// @ts-ignore
router.post('/create', handleCreateNotification)

export default router