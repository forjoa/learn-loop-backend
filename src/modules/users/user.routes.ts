import { Router } from 'express'
import { handleEditUser } from './user.controller'

const router = Router()

// @ts-ignore
router.put('/edit', handleEditUser)

export default router