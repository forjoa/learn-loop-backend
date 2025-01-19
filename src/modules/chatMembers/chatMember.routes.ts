import { Router } from 'express'
import { handleCreateChatMember, handleDeleteChatMember, handleGetAllMembers } from './chatMember.controller'

const router = Router()

// @ts-ignore
router.post('/create', handleCreateChatMember)
// @ts-ignore
router.post('/delete', handleDeleteChatMember)
// @ts-ignore
router.get('/getAllMembers', handleGetAllMembers)

export default router