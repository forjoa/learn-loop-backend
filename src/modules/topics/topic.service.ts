import prisma from '../../config/db'
import { CreateTopicInput, DeleteTopic, EditTopic, GetAllTopicsByOwner, GetAllTopicsByUser } from './topic.model'

export const createTopic = async (topic: CreateTopicInput) => {
    return prisma.topic.create({data: topic})
}

export const getAllTopicsByOwner = async (topic: GetAllTopicsByOwner) => {
    return prisma.topic.findMany({
        where: {
            ownerId: topic.ownerId
        }
    })
}

export const getAllTopicsByUser = async (topic: GetAllTopicsByUser) => {
    return prisma.topic.findMany({
        where: {
            users: {
                some: {
                    userId: topic.userId,
                    status: 'APPROVED'
                }
            }
        },
        include: {
            users: {
                where: {
                    userId: topic.userId,
                    status: 'APPROVED'
                },
                select: {
                    status: true,
                    userId: true
                }
            },
            owner: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export const deleteTopic = async (topic: DeleteTopic) => {
    return prisma.topic.delete({
        where: {
            id: topic.id
        }
    })
}

export const editTopic = async (topic: EditTopic) => {
    return prisma.topic.update({
        where: {
            id: topic.id
        },
        data: topic
    })
}