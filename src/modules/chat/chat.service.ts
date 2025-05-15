import prisma from '../../config/db'
import { GetChatsSchema } from './chat.model'

export const getChats = async (chat: GetChatsSchema) => {
    const chats = await prisma.chat_member.findMany({
        where: { userId: chat.userId },
        select: {
            chat: {
                select: {
                    id: true,
                    topicId: true,
                    topic: { select: { title: true } },
                    members: {
                        where: { userId: { not: chat.userId } },
                        select: { user: { select: { id: true, name: true } } }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: {
                            content: true,
                            createdAt: true
                        }
                    }
                }
            }
        }
    })

    return chats.map((chat) => {
        const lastMessage = chat.chat.messages[0]
        return {
            id: chat.chat.id,
            topicId: chat.chat.topicId,
            topicName: chat.chat.topic.title,
            members: chat.chat.members.map((member) => ({
                id: member.user.id,
                name: member.user.name
            })),
            lastMessage: lastMessage ? lastMessage.content : null,
            lastMessageDate: lastMessage ? lastMessage.createdAt : null
        }
    })
}