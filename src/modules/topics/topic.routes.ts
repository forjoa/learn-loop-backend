import { Router } from 'express'
import { handleCreateTopic, handleGetAllTopicsByOwner, handleGetAllTopicsByUser } from './topic.controller'

const router = Router()

// @ts-ignore
router.post('/', handleCreateTopic)
// @ts-ignore
router.get('/getAllByOwner', handleGetAllTopicsByOwner)
// @ts-ignore
router.get('/getAllByUser', handleGetAllTopicsByUser)

export default router