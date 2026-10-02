import { Router } from 'express'
import { handleCreateChatMember, handleDeleteChatMember, handleGetAllMembers } from './chatMember.controller.ts'

// Mounted at /chats/:chatId/members by the chat router, so mergeParams is
// required for these handlers to see :chatId.
export const chatMemberRouter = Router({ mergeParams: true })

// @ts-expect-error
chatMemberRouter.post('/', handleCreateChatMember)
// @ts-expect-error
chatMemberRouter.get('/', handleGetAllMembers)
// @ts-expect-error
chatMemberRouter.delete('/:id', handleDeleteChatMember)

export default chatMemberRouter
