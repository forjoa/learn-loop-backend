import prisma from '../../config/db.ts'
import type { DeleteUserInput, EditUserInput } from './user.model.ts'

export const editUser = async (user: EditUserInput) => {
    return prisma.user.update({ where: { id: user.id }, data: user })
}

// No FK cascades in the schema, so children go first: everything in the user's own topics, then their own rows elsewhere
export const deleteUser = async ({ id }: DeleteUserInput) => {
    const ownedTopic = { topic: { ownerId: id } }
    const enrollments = await prisma.enrollment.findMany({ where: { userId: id }, select: { id: true } })

    await prisma.$transaction([
        prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { chat: ownedTopic }] } }),
        prisma.chat_member.deleteMany({ where: { OR: [{ userId: id }, { chat: ownedTopic }] } }),
        prisma.chat.deleteMany({ where: ownedTopic }),
        prisma.file.deleteMany({ where: { post: { OR: [{ userId: id }, ownedTopic] } } }),
        prisma.post.deleteMany({ where: { OR: [{ userId: id }, ownedTopic] } }),
        prisma.enrollment.deleteMany({ where: { OR: [{ userId: id }, ownedTopic] } }),
        // also the owners' "Nueva solicitud" notifications pointing at this user's enrollments
        prisma.notification.deleteMany({
            where: { OR: [{ userId: id }, { enrollmentId: { in: enrollments.map((e) => e.id) } }] },
        }),
        prisma.topic.deleteMany({ where: { ownerId: id } }),
        prisma.user.delete({ where: { id } }),
    ])
}
