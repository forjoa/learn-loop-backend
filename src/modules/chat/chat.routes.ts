import { Router } from 'express'
import { handleGetChatById, handleGetChats } from './chat.controller.ts'

const router = Router()

// @ts-expect-error
router.get('/getAll', handleGetChats)
// @ts-expect-error
router.get('/chat', handleGetChatById)

export default router
