import prisma from '../../config/db.ts'
import type {
    CreateNotificationSchema,
    DeleteNotificationSchema,
    GetNotificationsSchema,
} from './notification.model.ts'

export const createNotification = async (notification: CreateNotificationSchema) => {
    return prisma.notification.create({ data: notification })
}

export const getNofitications = async (notification: GetNotificationsSchema) => {
    return prisma.notification.findMany({
        where: {
            userId: notification.userId,
        },
    })
}

export const deleteNotification = async (notification: DeleteNotificationSchema) => {
    return prisma.notification.delete({
        where: {
            id: notification.id,
        },
    })
}
