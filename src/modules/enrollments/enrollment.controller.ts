import { Request, Response } from 'express'
import { acceptEnrollmentSchema, createEnrollmentSchema, denyEnrollmentSchema } from './enrollment.model'
import { acceptEnrollment, createEnrollment, denyEnrollment } from './enrollment.service'
import { errorHandler } from '../../lib/utils'

export const handleCreateEnrollment = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createEnrollmentSchema.parse(req.body)

        // call service to create and enrollment
        const enrollment = await createEnrollment(validateData)

        return res.status(200).json({
            message: 'Enrollment created successfully',
            data: enrollment
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
            data: enrollment
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
            data: enrollment
        })
    } catch (error) {
        errorHandler(res, error)
    }
}