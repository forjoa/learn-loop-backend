import prisma from '../../config/db';
import { GetChatsSchema } from './chat.model'

export const getChats = async (chat: GetChatsSchema) => {
    const chats = await prisma.chat_member.findMany({
        where: {
            userId: chat.userId,
        },
        select: {
            chat: {
                select: {
                    id: true,
                    topicId: true,
                    topic: {
                        select: {
                            title: true,
                        },
                    },
                    members: {
                        where: {
                            userId: {
                                not: chat.userId
                            }
                        },
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return chats.map(chatMember => ({
        chat_id: chatMember.chat.id,
        topic_id: chatMember.chat.topicId,
        topic_name: chatMember.chat.topic.title,
        users: chatMember.chat.members.map(member => ({
            user_id: member.user.id,
            user_name: member.user.name,
        }))
    }))
}