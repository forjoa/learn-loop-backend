import { Router } from 'express'
import { handleCreateUser, handleLogin } from './auth.controller'

const router = Router()

// create user endpoint
// @ts-ignore
router.post('/register', handleCreateUser)
router.post('/login', handleLogin)

export default router