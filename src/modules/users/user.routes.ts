import {Router} from "express";
import {handleEditUser} from "./user.controller";

const router = Router();

// @ts-ignore
router.post('/edit', handleEditUser)

export default router;