import { Router } from 'express'
import { handleCreateChatMember, handleDeleteChatMember } from './chatMember.controller'

const router = Router()

// @ts-ignore
router.post('/create', handleCreateChatMember)
// @ts-ignore
router.post('/delete', handleDeleteChatMember)

export default router