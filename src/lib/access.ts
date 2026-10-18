import prisma from '../config/db.ts'
import { HttpError } from './utils.ts'

// Owner or approved student of a topic
const canAccessTopic = (userId: string) => ({
    OR: [{ ownerId: userId }, { users: { some: { userId, status: 'APPROVED' } } }],
})

// Missing and not-allowed both answer 403, so ids can't be probed for existence
const allow = (found: unknown) => {
    if (!found) throw new HttpError(403, 'Forbidden')
}

export const assertSelf = (userId: string, authUserId: string) => allow(userId === authUserId)

export const assertTopicOwner = async (topicId: string, userId: string) =>
    allow(await prisma.topic.findFirst({ where: { id: topicId, ownerId: userId }, select: { id: true } }))

export const assertTopicAccess = async (topicId: string, userId: string) =>
    allow(await prisma.topic.findFirst({ where: { id: topicId, ...canAccessTopic(userId) }, select: { id: true } }))

export const assertPostAccess = async (postId: string, userId: string) =>
    allow(await prisma.post.findFirst({ where: { id: postId, topic: canAccessTopic(userId) }, select: { id: true } }))

export const assertEnrollmentTopicOwner = async (enrollmentId: string, userId: string) =>
    allow(
        await prisma.enrollment.findFirst({
            where: { id: enrollmentId, topic: { ownerId: userId } },
            select: { id: true },
        }),
    )

export const assertNotificationOwner = async (notificationId: string, userId: string) =>
    allow(await prisma.notification.findFirst({ where: { id: notificationId, userId }, select: { id: true } }))

export const assertChatMember = async (chatId: string, userId: string) =>
    allow(await prisma.chat_member.findUnique({ where: { chatId_userId: { chatId, userId } }, select: { id: true } }))
