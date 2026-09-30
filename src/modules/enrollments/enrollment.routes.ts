import { Router } from 'express'
import { handleAcceptEnrollment, handleCreateEnrollment, handleDenyEnrollment } from './enrollment.controller.ts'

const router = Router()

// @ts-expect-error
router.post('/create', handleCreateEnrollment)
// @ts-expect-error
router.post('/accept', handleAcceptEnrollment)
// @ts-expect-error
router.post('/deny', handleDenyEnrollment)

export default router
