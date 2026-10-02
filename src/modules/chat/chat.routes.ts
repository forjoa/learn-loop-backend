import { Router } from 'express'
import { chatMemberRouter } from '../chatMembers/chatMember.routes.ts'
import { chatMessageRouter } from '../messages/message.routes.ts'
import { handleGetChatById, handleGetChats } from './chat.controller.ts'

const router = Router()

// chat-scoped collections owned by other modules
router.use('/:chatId/members', chatMemberRouter)
router.use('/:chatId/messages', chatMessageRouter)

// @ts-expect-error
router.get('/:id', handleGetChatById)

export default router

// GET /users/:userId/chats - mounted by the users router
export const userChatRouter = Router({ mergeParams: true })

// @ts-expect-error
userChatRouter.get('/', handleGetChats)
