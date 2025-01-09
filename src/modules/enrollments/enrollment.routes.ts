import {Router} from "express";
import {handleAcceptEnrollment, handleCreateEnrollment} from "./enrollment.controller";

const router = Router();

// @ts-ignore
router.post('/create', handleCreateEnrollment)
// @ts-ignore
router.post('/accept', handleAcceptEnrollment)

export default router;