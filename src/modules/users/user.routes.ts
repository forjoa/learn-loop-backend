import { Router } from 'express'
import { handleEditUser } from './user.controller.ts'

const router = Router()

// @ts-expect-error
router.put('/edit', handleEditUser)

export default router
