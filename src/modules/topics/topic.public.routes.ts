import { Router } from 'express'
import { handleGetTopicPreview } from './topic.controller.ts'

const router = Router()

// Unauthenticated: used by the "join via link" screen before the visitor has an
// account, or before SecureStore has a token loaded yet.
// @ts-expect-error
router.get('/:id', handleGetTopicPreview)

export default router
