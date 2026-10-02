import prisma from '../../config/db.ts'
import type {
    AcceptEnrollmentSchema,
    CreateEnrollmentSchema,
    DenyEnrollmentSchema,
    GetEnrollmentStatusSchema,
    GetPendingEnrollmentsSchema,
} from './enrollment.model.ts'

export const createEnrollment = async (enrollment: CreateEnrollmentSchema) => {
    const topic = await prisma.topic.findUnique({
        where: { id: enrollment.topicId },
        select: { ownerId: true, title: true },
    })

    if (!topic) {
        throw new Error('El topic no existe')
    }

    const user = await prisma.user.findUnique({
        where: { id: enrollment.userId },
        select: { name: true },
    })

    if (!user) {
        throw new Error('El usuario no existe')
    }

    const existing = await prisma.enrollment.findFirst({
        where: { userId: enrollment.userId, topicId: enrollment.topicId },
    })

    if (existing) {
        // A PENDING or APPROVED enrollment already covers this request - don't create
        // a duplicate row. A REJECTED one can be re-requested by flipping it back to
        // PENDING instead of accumulating a new row per attempt.
        if (existing.status !== 'REJECTED') {
            return existing
        }

        return prisma.enrollment.update({
            where: { id: existing.id },
            data: { status: 'PENDING' },
        })
    }

    const newEnrollment = await prisma.enrollment.create({ data: enrollment })

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
        where: { id: enrollment.id },
        data: enrollment,
        include: { topic: { select: { title: true } } },
    })

    const topicChat = await prisma.chat.findFirst({
        where: {
            topicId: updatedEnrollment.topicId,
        },
    })

    await prisma.chat_member.create({
        data: {
            userId: updatedEnrollment.userId,
            chatId: topicChat?.id || '',
        },
    })

    await prisma.notification.deleteMany({
        where: { enrollmentId: enrollment.id },
    })

    await prisma.notification.create({
        data: {
            userId: updatedEnrollment.userId,
            title: 'Solicitud aceptada',
            content: `Tu solicitud para unirte a ${updatedEnrollment.topic.title} fue aceptada.`,
        },
    })

    return updatedEnrollment
}

export const denyEnrollment = async (enrollment: DenyEnrollmentSchema) => {
    const updatedEnrollment = await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: enrollment,
        include: { topic: { select: { title: true } } },
    })

    await prisma.notification.deleteMany({
        where: { enrollmentId: enrollment.id },
    })

    await prisma.notification.create({
        data: {
            userId: updatedEnrollment.userId,
            title: 'Solicitud rechazada',
            content: `Tu solicitud para unirte a ${updatedEnrollment.topic.title} fue rechazada.`,
        },
    })

    return updatedEnrollment
}

export const getEnrollmentStatus = async (params: GetEnrollmentStatusSchema) => {
    const enrollment = await prisma.enrollment.findFirst({
        where: { userId: params.userId, topicId: params.topicId },
        orderBy: { id: 'desc' },
        select: { id: true, status: true },
    })

    return enrollment
}

export const getPendingEnrollmentsByTopic = async (params: GetPendingEnrollmentsSchema) => {
    const enrollments = await prisma.enrollment.findMany({
        where: { topicId: params.topicId, status: 'PENDING' },
        select: {
            id: true,
            user: { select: { id: true, name: true, email: true, photo: true } },
        },
    })

    return enrollments
}
