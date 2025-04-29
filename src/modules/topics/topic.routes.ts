import { Router } from 'express'
import {
    handleCreateTopic,
    handleDeleteTopic, handleEditTopic,
    handleGetAllTopicsByOwner,
    handleGetAllTopicsByUser,
    handleGetAllTopics
} from './topic.controller'

const router = Router()

// @ts-ignore
router.post('/', handleCreateTopic)
// @ts-ignore
router.get('/', handleGetAllTopics)
// @ts-ignore
router.get('/getAllByOwner', handleGetAllTopicsByOwner)
// @ts-ignore
router.get('/getAllByUser', handleGetAllTopicsByUser)
// @ts-ignore
router.delete('/delete', handleDeleteTopic)
// @ts-ignore
router.put('/edit', handleEditTopic)

export default router
