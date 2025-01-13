import { CreateNotificationSchema, GetNotificationsSchema } from './notification.model'
import prisma from '../../config/db'

export const createNotification = async (notification: CreateNotificationSchema) => {
    return prisma.notification.create({data: notification})
}

export const getNofitications = async (notification: GetNotificationsSchema) => {
    return prisma.notification.findMany({
        where: {
            userId: notification.userId
        }
    })
}