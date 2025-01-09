import {CreateEnrollmentSchema} from "./enrollment.model";
import prisma from "../../config/db";

export const createEnrollment = async (enrollment: CreateEnrollmentSchema) => {
    return prisma.enrollment.create({data: enrollment})
}