import {Router} from "express";
import {handleCreateMessage} from "./message.controller";

const router = Router()

// @ts-ignore
router.post('/send', handleCreateMessage)

export default router