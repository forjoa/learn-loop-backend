import { AcceptEnrollmentSchema, CreateEnrollmentSchema, DenyEnrollmentSchema } from './enrollment.model'
import prisma from '../../config/db'

export const createEnrollment = async (enrollment: CreateEnrollmentSchema) => {
    const topic = await prisma.topic.findUnique({
        where: {id: enrollment.topicId},
        select: {ownerId: true, title: true},
    })

    if (!topic) {
        throw new Error('El topic no existe')
    }

    const user = await prisma.user.findUnique({
        where: {id: enrollment.userId},
        select: {name: true},
    })

    if (!user) {
        throw new Error('El usuario no existe')
    }

    const newEnrollment = await prisma.enrollment.create({data: enrollment})

    await prisma.notification.create({
        data: {
            userId: topic.ownerId,
            title: 'Nueva solicitud',
            content: `${user.name} ha solicitado unirse a ${topic.title}`,
            enrollmentId: newEnrollment.id || undefined,
        },
    })

    return newEnrollment
}

export const acceptEnrollment = async (enrollment: AcceptEnrollmentSchema) => {
    const updatedEnrollment = await prisma.enrollment.update({
        where: {id: enrollment.id},
        data: enrollment
    })

    await prisma.notification.deleteMany({
        where: {enrollmentId: enrollment.id}
    })

    return updatedEnrollment
}

export const denyEnrollment = async (enrollment: DenyEnrollmentSchema) => {
    const updatedEnrollment = await prisma.enrollment.update({
        where: {id: enrollment.id},
        data: enrollment
    })

    await prisma.notification.deleteMany({
        where: {enrollmentId: enrollment.id}
    })

    return updatedEnrollment
}
