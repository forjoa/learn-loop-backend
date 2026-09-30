import { Router } from 'express'
import { handleCreateMessage, handleGetMessages } from './message.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/send', handleCreateMessage)
// @ts-expect-error
router.get('/get', handleGetMessages)

export default router
