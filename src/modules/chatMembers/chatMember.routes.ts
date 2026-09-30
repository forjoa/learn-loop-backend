import { Router } from 'express'
import { handleCreateChatMember, handleDeleteChatMember, handleGetAllMembers } from './chatMember.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/create', handleCreateChatMember)
// @ts-expect-error
router.post('/delete', handleDeleteChatMember)
// @ts-expect-error
router.get('/getAllMembers', handleGetAllMembers)

export default router
