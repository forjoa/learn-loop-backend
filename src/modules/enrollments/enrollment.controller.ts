import {Request, Response} from "express";
import {createEnrollmentSchema} from "./enrollment.model";
import {createEnrollment} from "./enrollment.service";

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
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}