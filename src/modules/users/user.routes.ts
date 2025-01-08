import {Router} from "express";
import {handleCreateUser, handleLogin} from "./user.controller";

const router = Router();

// create user endpoint
// @ts-ignore
router.post('/', handleCreateUser);
router.post('/login', handleLogin);

export default router;