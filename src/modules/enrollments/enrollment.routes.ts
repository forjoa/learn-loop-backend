import { Router } from 'express'
import {
    handleCreateEnrollment,
    handleGetEnrollmentStatus,
    handleGetPendingEnrollments,
    handleUpdateEnrollmentStatus,
} from './enrollment.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/', handleCreateEnrollment)
// @ts-expect-error
router.get('/', handleGetEnrollmentStatus)
// @ts-expect-error
router.patch('/:id', handleUpdateEnrollmentStatus)

export default router

// GET /topics/:topicId/enrollments - mounted by the topics router
export const topicEnrollmentRouter = Router({ mergeParams: true })

// @ts-expect-error
topicEnrollmentRouter.get('/', handleGetPendingEnrollments)
