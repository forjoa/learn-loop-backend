import {Router} from "express";
import {handleCreateEnrollment} from "./enrollment.controller";

const router = Router();

// @ts-ignore
router.post('/create', handleCreateEnrollment)

export default router;