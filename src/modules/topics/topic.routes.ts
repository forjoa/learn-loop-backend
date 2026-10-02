import { Router } from 'express'
import { topicEnrollmentRouter } from '../enrollments/enrollment.routes.ts'
import {
    handleCreateTopic,
    handleDeleteTopic,
    handleEditTopic,
    handleGetAllTopics,
    handleGetAllTopicsByUser,
    handleGetTopicById,
} from './topic.controller.ts'

const router = Router()

// topic-scoped collections owned by other modules
router.use('/:topicId/enrollments', topicEnrollmentRouter)

// @ts-expect-error
router.post('/', handleCreateTopic)
// @ts-expect-error
router.get('/', handleGetAllTopics)
// @ts-expect-error
router.get('/:id', handleGetTopicById)
// @ts-expect-error
router.put('/:id', handleEditTopic)
// @ts-expect-error
router.delete('/:id', handleDeleteTopic)

export default router

// GET /users/:userId/topics - mounted by the users router
export const userTopicRouter = Router({ mergeParams: true })

// @ts-expect-error
userTopicRouter.get('/', handleGetAllTopicsByUser)
