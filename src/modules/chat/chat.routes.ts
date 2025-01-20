import { Router } from 'express'
import { handleGetChats } from './chat.controller'

const router = Router()

// @ts-ignore
router.get('/getAll', handleGetChats)

export default router