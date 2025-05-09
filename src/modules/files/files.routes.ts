import { Router } from 'express'
import { handleCreateFile } from './files.controller'

const router = Router()

// @ts-ignore
router.post('/', handleCreateFile)

export default router