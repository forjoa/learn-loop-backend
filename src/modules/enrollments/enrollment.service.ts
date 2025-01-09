import {AcceptEnrollmentSchema, CreateEnrollmentSchema} from "./enrollment.model";
import prisma from "../../config/db";

export const createEnrollment = async (enrollment: CreateEnrollmentSchema) => {
    return prisma.enrollment.create({data: enrollment})
}

export const acceptEnrollment = async (enrollment: AcceptEnrollmentSchema) => {
    return prisma.enrollment.update({where: {id: enrollment.id}, data: enrollment})
}