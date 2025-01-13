import { Router } from 'express'
import { handleCreateMessage, handleGetMessages } from './message.controller'

const router = Router()

// @ts-ignore
router.post('/send', handleCreateMessage)
// @ts-ignore
router.get('/get', handleGetMessages)

export default router