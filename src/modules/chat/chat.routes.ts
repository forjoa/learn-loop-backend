import { Router } from 'express'
import { handleGetChats } from './chat.controller.ts'

const router = Router()

// @ts-expect-error
router.get('/getAll', handleGetChats)

export default router
