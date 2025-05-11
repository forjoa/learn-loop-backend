import { z } from 'zod'

export const createEnrollmentSchema = z.object({
    userId: z.string(),
    topicId: z.string(),
    status: z.enum([ 'PENDING', 'APPROVED', 'REJECTED' ]).default('PENDING')
})

export type CreateEnrollmentSchema = z.infer<typeof createEnrollmentSchema>

export const acceptEnrollmentSchema = z.object({
    id: z.string(),
    status: z.enum([ 'PENDING', 'APPROVED', 'REJECTED' ]).default('APPROVED')
})

export type AcceptEnrollmentSchema = z.infer<typeof acceptEnrollmentSchema>

export const denyEnrollmentSchema = z.object({
    id: z.string(),
    status: z.enum([ 'PENDING', 'APPROVED', 'REJECTED' ]).default('REJECTED')
})

export type DenyEnrollmentSchema = z.infer<typeof denyEnrollmentSchema>