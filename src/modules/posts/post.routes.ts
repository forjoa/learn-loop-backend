import { Router } from 'express'
import { handleCreatePost } from './post.controller'

const router = Router()

// @ts-ignore
router.post('/', handleCreatePost)

export default router