import prisma from '../../config/db'
import {
    CreateTopicInput,
    DeleteTopic,
    EditTopic,
    GetAllTopicsByOwner,
    GetAllTopicsByUser,
    GetTopic
} from './topic.model'

export const createTopic = async (topic: CreateTopicInput) => {
    return prisma.topic.create({data: topic})
}

export const getAllTopics = async () => {
    return prisma.topic.findMany()
}

export const getAllTopicsByOwner = async (topic: GetAllTopicsByOwner) => {
    return prisma.topic.findMany({
        where: {
            ownerId: topic.ownerId
        }
    })
}

export const getAllTopicsByUser = async (topic: GetAllTopicsByUser) => {
    // Get topics where user is enrolled with APPROVED status
    const enrolledTopics = await prisma.topic.findMany({
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

    // Get topics where user is the owner (teacher)
    const ownedTopics = await prisma.topic.findMany({
        where: {
            ownerId: topic.userId
        },
        include: {
            users: {
                where: {
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

    // Combine both sets of topics, ensuring no duplicates
    const allTopics = [...enrolledTopics]

    // Add owned topics that aren't already in the enrolled topics
    for (const ownedTopic of ownedTopics) {
        if (!allTopics.some(topic => topic.id === ownedTopic.id)) {
            allTopics.push(ownedTopic)
        }
    }

    return allTopics
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

export const getTopicById = async (topic: GetTopic) => {
    const result = await prisma.topic.findUnique({
        where: {
            id: topic.id,
        },
        include: {
            owner: true,
            users: {
                where: {
                    status: 'APPROVED',
                },
                include: {
                    user: true,
                },
            },
            posts: true,
        },
    })

    if (!result) return null

    return {
        ...result,
        users: result.users.map(enrollment => enrollment.user),
        posts: result.posts,
    }
}