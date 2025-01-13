import { Router } from 'express'
import { handleAcceptEnrollment, handleCreateEnrollment, handleDenyEnrollment } from './enrollment.controller'

const router = Router()

// @ts-ignore
router.post('/create', handleCreateEnrollment)
// @ts-ignore
router.post('/accept', handleAcceptEnrollment)
// @ts-ignore
router.post('/deny', handleDenyEnrollment)

export default router