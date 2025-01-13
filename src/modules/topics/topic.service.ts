import prisma from '../../config/db'
import { CreateTopicInput, GetAllTopicsByOwner } from './topic.model'

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