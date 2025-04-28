import { Router } from 'express'
import { handleCreateUser, handleLogin, handleValidateToken } from './auth.controller'

const router = Router()

// create user endpoint
// @ts-ignore
router.post('/register', handleCreateUser)
router.post('/login', handleLogin)
// @ts-ignore
router.get('/me/:token', handleValidateToken)

export default router
