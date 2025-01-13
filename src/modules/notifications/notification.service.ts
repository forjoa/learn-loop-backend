import { CreateNotificationSchema } from './notification.model'
import prisma from '../../config/db'

export const createNotification = async (notification: CreateNotificationSchema) => {
    return prisma.notification.create({data: notification})
}