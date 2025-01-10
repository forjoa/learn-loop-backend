import {Router} from "express";
import {handleCreateChatMember} from "./chatMember.controller";

const router = Router();

// @ts-ignore
router.post('/create', handleCreateChatMember);

export default router;