import { Router } from 'express'
import { handleCreateMessage, handleGetMessages } from './message.controller.ts'

// Mounted at /chats/:chatId/messages by the chat router, so mergeParams is
// required for these handlers to see :chatId.
export const chatMessageRouter = Router({ mergeParams: true })

// @ts-expect-error
chatMessageRouter.post('/', handleCreateMessage)
// @ts-expect-error
chatMessageRouter.get('/', handleGetMessages)

export default chatMessageRouter
