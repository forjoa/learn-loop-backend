import { Router } from 'express'
import { handleGenerateExam } from './exam.controller.ts'

// POST /topics/:topicId/exam - mounted by the topics router
export const topicExamRouter = Router({ mergeParams: true })

// @ts-expect-error
topicExamRouter.post('/', handleGenerateExam)
