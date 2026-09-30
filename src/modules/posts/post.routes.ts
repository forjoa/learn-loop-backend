import { Router } from 'express'
import { handleCreatePost, handleGetSinglePost } from './post.controller.ts'

const router = Router()

// @ts-ignore
router.post('/', handleCreatePost)
// @ts-ignore
router.get('/', handleGetSinglePost)

export default router