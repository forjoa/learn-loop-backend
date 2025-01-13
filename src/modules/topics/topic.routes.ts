import { Router } from 'express'
import { handleCreateTopic, handleGetAllTopicsByOwner } from './topic.controller'

const router = Router()

// @ts-ignore
router.post('/', handleCreateTopic)
// @ts-ignore
router.get('/getAllByOwner', handleGetAllTopicsByOwner)

export default router