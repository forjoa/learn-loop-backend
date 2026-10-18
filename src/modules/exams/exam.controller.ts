import type { Request, Response } from 'express'
import { assertTopicOwner } from '../../lib/access.ts'
import { errorHandler } from '../../lib/utils.ts'
import { generateExamSchema } from './exam.model.ts'
import { generateExam } from './exam.service.ts'

export const handleGenerateExam = async (req: Request, res: Response) => {
    try {
        const validateData = generateExamSchema.parse({ topicId: req.params.topicId })
        await assertTopicOwner(validateData.topicId, req.user.userId)

        // call service to build the exam from the topic's posts and files
        const exam = await generateExam(validateData)

        return res.status(200).json(exam)
    } catch (error) {
        errorHandler(res, error)
    }
}
