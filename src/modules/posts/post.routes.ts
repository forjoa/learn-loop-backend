import { Router } from 'express'
import { handleCreatePost, handleGetSinglePost } from './post.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/', handleCreatePost)
// @ts-expect-error
router.get('/:id', handleGetSinglePost)

export default router
