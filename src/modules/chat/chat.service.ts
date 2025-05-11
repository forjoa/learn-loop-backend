import prisma from '../../config/db'
import { GetChatsSchema } from './chat.model'

export const getChats = async (chat: GetChatsSchema) => {
    const chats = await prisma.chat_member.findMany({
        where: {userId: chat.userId},
        select: {
            chat: {
                select: {
                    id: true,
                    topicId: true,
                    topic: {select: {title: true}},
                    members: {
                        where: {userId: {not: chat.userId}},
                        select: {user: {select: {id: true, name: true}}}
                    }
                }
            }
        }
    })

    return chats.map((chat) => ({
        id: chat.chat.id,
        topicId: chat.chat.topicId,
        topicName: chat.chat.topic.title,
        members: chat.chat.members.map((member) => ({
            id: member.user.id,
            name: member.user.name
        }))
    }))
}