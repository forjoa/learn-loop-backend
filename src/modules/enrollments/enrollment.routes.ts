import { Router } from 'express'
import {
    handleAcceptEnrollment,
    handleCreateEnrollment,
    handleDenyEnrollment,
    handleGetEnrollmentStatus,
    handleGetPendingEnrollments,
} from './enrollment.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/create', handleCreateEnrollment)
// @ts-expect-error
router.post('/accept', handleAcceptEnrollment)
// @ts-expect-error
router.post('/deny', handleDenyEnrollment)
// @ts-expect-error
router.get('/status', handleGetEnrollmentStatus)
// @ts-expect-error
router.get('/pending', handleGetPendingEnrollments)

export default router
