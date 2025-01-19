import { CreateChatMemberSchema, DeleteChatMemberSchema, GetAllMembers } from './chatMember.model'
import prisma from '../../config/db'

export const createChatMember = async (chatMember: CreateChatMemberSchema) => {
    return prisma.chat_member.create({data: chatMember})
}

export const deleteChatMember = async (chatMember: DeleteChatMemberSchema) => {
    return prisma.chat_member.delete({where: {id: chatMember.id}})
}

export const getAllMembers = async (chatMember: GetAllMembers) => {
    return prisma.chat.findUnique({
        where: {
            id: chatMember.chatId
        },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    })
}