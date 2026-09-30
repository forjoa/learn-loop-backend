import { Router } from 'express'
import {
    handleCreateTopic,
    handleDeleteTopic,
    handleEditTopic,
    handleGetAllTopics,
    handleGetAllTopicsByOwner,
    handleGetAllTopicsByUser,
    handleGetTopicById,
} from './topic.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/', handleCreateTopic)
// @ts-expect-error
router.get('/', handleGetAllTopics)
// @ts-expect-error
router.get('/getAllByOwner', handleGetAllTopicsByOwner)
// @ts-expect-error
router.get('/getAllByUser', handleGetAllTopicsByUser)
// @ts-expect-error
router.delete('/delete', handleDeleteTopic)
// @ts-expect-error
router.put('/edit', handleEditTopic)
// @ts-expect-error
router.get('/topic', handleGetTopicById)

export default router
