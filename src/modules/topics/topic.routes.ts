import { Router } from 'express'
import {
    handleCreateTopic,
    handleDeleteTopic,
    handleGetAllTopicsByOwner,
    handleGetAllTopicsByUser
} from './topic.controller'

const router = Router()

// @ts-ignore
router.post('/', handleCreateTopic)
// @ts-ignore
router.get('/getAllByOwner', handleGetAllTopicsByOwner)
// @ts-ignore
router.get('/getAllByUser', handleGetAllTopicsByUser)
// @ts-ignore
router.delete('/delete', handleDeleteTopic)

export default router