import {CreateChatMemberSchema} from "./chatMember.model";
import prisma from "../../config/db";

export const createChatMember = async (chatMember: CreateChatMemberSchema) => {
    return prisma.chat_member.create({data: chatMember})
}

export const deleteChatMember = async (chatMemberId: number) => {
    return prisma.chat_member.delete({where: {id: chatMemberId}})
}