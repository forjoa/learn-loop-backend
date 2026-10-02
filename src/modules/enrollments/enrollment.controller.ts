import type { Request, Response } from 'express'
import { errorHandler } from '../../lib/utils.ts'
import {
    acceptEnrollmentSchema,
    createEnrollmentSchema,
    denyEnrollmentSchema,
    getEnrollmentStatusSchema,
    getPendingEnrollmentsSchema,
} from './enrollment.model.ts'
import {
    acceptEnrollment,
    createEnrollment,
    denyEnrollment,
    getEnrollmentStatus,
    getPendingEnrollmentsByTopic,
} from './enrollment.service.ts'

export const handleCreateEnrollment = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createEnrollmentSchema.parse(req.body)

        // call service to create and enrollment
        const enrollment = await createEnrollment(validateData)

        return res.status(200).json({
            message: 'Enrollment created successfully',
            data: enrollment,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleAcceptEnrollment = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = acceptEnrollmentSchema.parse(req.body)

        // call service to accept
        const enrollment = await acceptEnrollment(validateData)

        return res.status(200).json({
            message: 'Enrollment accepted successfully',
            data: enrollment,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleDenyEnrollment = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = denyEnrollmentSchema.parse(req.body)

        // call service to deny
        const enrollment = await denyEnrollment(validateData)

        return res.status(200).json({
            message: 'Enrollment denied successfully',
            data: enrollment,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetEnrollmentStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
        const topicId = req.query.topicId
        const validateData = getEnrollmentStatusSchema.parse({ userId, topicId })

        const status = await getEnrollmentStatus(validateData)

        return res.status(200).json(status)
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetPendingEnrollments = async (req: Request, res: Response) => {
    try {
        const topicId = req.query.topicId
        const validateData = getPendingEnrollmentsSchema.parse({ topicId })

        const enrollments = await getPendingEnrollmentsByTopic(validateData)

        return res.status(200).json(enrollments)
    } catch (error) {
        errorHandler(res, error)
    }
}
