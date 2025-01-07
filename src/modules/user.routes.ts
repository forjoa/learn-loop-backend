import {Router} from "express";
import {handleCreateUser} from "./user.controller";

const router = Router();

// create user endpoint
// @ts-ignore
router.post('/', handleCreateUser);

export default router;