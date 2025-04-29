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

    await prisma.notification.create({
        data: {
            userId: topic.ownerId,
            title: 'Nueva solicitud',
            content: `${user.name} ha solicitado unirse a ${topic.title}`,
        },
    })
    return prisma.enrollment.create({data: enrollment})
}

export const acceptEnrollment = async (enrollment: AcceptEnrollmentSchema) => {
    return prisma.enrollment.update({where: {id: enrollment.id}, data: enrollment})
}

export const denyEnrollment = async (enrollment: DenyEnrollmentSchema) => {
    return prisma.enrollment.update({where: {id: enrollment.id}, data: enrollment})
}