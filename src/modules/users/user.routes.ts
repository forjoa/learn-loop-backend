import { Router } from 'express'
import { userChatRouter } from '../chat/chat.routes.ts'
import { userNotificationRouter } from '../notifications/notification.routes.ts'
import { userTopicRouter } from '../topics/topic.routes.ts'
import { handleEditUser } from './user.controller.ts'

const router = Router()

// user-scoped collections owned by other modules
router.use('/:userId/topics', userTopicRouter)
router.use('/:userId/chats', userChatRouter)
router.use('/:userId/notifications', userNotificationRouter)

// @ts-expect-error
router.put('/:id', handleEditUser)

export default router
