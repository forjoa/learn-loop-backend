import {Router} from "express";
import {handleCreateTopic} from "./topic.controller";

const router = Router();

// create topic endpoint
// @ts-ignore
router.post('/', handleCreateTopic);

export default router;