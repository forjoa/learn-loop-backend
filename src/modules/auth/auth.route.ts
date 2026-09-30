import { Router } from 'express'
import { handleCreateUser, handleLogin, handleValidateToken } from './auth.controller.ts'

const router = Router()

// create user endpoint
// @ts-expect-error
router.post('/register', handleCreateUser)
router.post('/login', handleLogin)
// @ts-expect-error
router.get('/me/:token', handleValidateToken)

export default router
