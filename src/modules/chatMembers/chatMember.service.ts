import { CreateChatMemberSchema, DeleteChatMemberSchema } from './chatMember.model'
import prisma from '../../config/db'

export const createChatMember = async (chatMember: CreateChatMemberSchema) => {
    return prisma.chat_member.create({data: chatMember})
}

export const deleteChatMember = async (chatMember: DeleteChatMemberSchema) => {
    return prisma.chat_member.delete({where: {id: chatMember.id}})
}