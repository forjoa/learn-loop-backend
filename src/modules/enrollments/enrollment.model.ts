import {z} from "zod";

export const createEnrollmentSchema = z.object({
    userId: z.number(),
    topicId: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING")
})

export type CreateEnrollmentSchema = z.infer<typeof createEnrollmentSchema>

export const acceptEnrollmentSchema = z.object({
    id: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("APPROVED")
})

export type AcceptEnrollmentSchema = z.infer<typeof acceptEnrollmentSchema>

export const denyEnrollmentSchema = z.object({
    id: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("REJECTED")
})

export type DenyEnrollmentSchema = z.infer<typeof denyEnrollmentSchema>