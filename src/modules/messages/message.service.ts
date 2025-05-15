import { CreateMessageSchema, GetMessagesSchema } from './message.model'
import prisma from '../../config/db'

export const createMessage = async (message: CreateMessageSchema) => {
  return prisma.message.create({
    data: {
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
    },
    select: {
      id: true,
      chatId: true,
      senderId: true,
      content: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export const getMessages = async (chat: GetMessagesSchema) => {
  return prisma.message.findMany({
    where: { chatId: chat.chatId },
    select: {
      id: true,
      chatId: true,
      senderId: true,
      content: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}
