import prisma from '../../config/db.ts'
import type {
    CreateTopicInput,
    DeleteTopic,
    EditTopic,
    GetAllTopicsByOwner,
    GetAllTopicsByUser,
    GetTopic,
} from './topic.model.ts'

export const createTopic = async (topic: CreateTopicInput) => {
    const currentTopic = await prisma.topic.create({ data: topic })

    const newChat = await prisma.chat.create({
        data: {
            topicId: currentTopic.id,
        },
    })

    await prisma.chat_member.create({
        data: {
            userId: topic.ownerId,
            chatId: newChat.id,
        },
    })

    return currentTopic
}

export const getAllTopics = async () => {
    return prisma.topic.findMany()
}

export const getAllTopicsByOwner = async (topic: GetAllTopicsByOwner) => {
    return prisma.topic.findMany({
        where: {
            ownerId: topic.ownerId,
        },
    })
}

export const getAllTopicsByUser = async (topic: GetAllTopicsByUser) => {
    // Get topics where user is enrolled with APPROVED status
    const enrolledTopics = await prisma.topic.findMany({
        where: {
            users: {
                some: {
                    userId: topic.userId,
                    status: 'APPROVED',
                },
            },
        },
        include: {
            users: {
                where: {
                    userId: topic.userId,
                    status: 'APPROVED',
                },
                select: {
                    status: true,
                    userId: true,
                },
            },
            owner: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    // Get topics where user is the owner (teacher)
    const ownedTopics = await prisma.topic.findMany({
        where: {
            ownerId: topic.userId,
        },
        include: {
            users: {
                where: {
                    status: 'APPROVED',
                },
                select: {
                    status: true,
                    userId: true,
                },
            },
            owner: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    // Combine both sets of topics, ensuring no duplicates
    const allTopics = [...enrolledTopics]

    // Add owned topics that aren't already in the enrolled topics
    for (const ownedTopic of ownedTopics) {
        if (!allTopics.some((topic) => topic.id === ownedTopic.id)) {
            allTopics.push(ownedTopic)
        }
    }

    return allTopics
}

export const deleteTopic = async (topic: DeleteTopic) => {
    const chats = await prisma.chat.findMany({
        where: { topicId: topic.id },
        select: { id: true },
    })
    const chatIds = chats.map((chat) => chat.id)

    const posts = await prisma.post.findMany({
        where: { topicId: topic.id },
        select: { id: true },
    })
    const postIds = posts.map((post) => post.id)

    const [, , , , , , deletedTopic] = await prisma.$transaction([
        prisma.message.deleteMany({ where: { chatId: { in: chatIds } } }),
        prisma.chat_member.deleteMany({ where: { chatId: { in: chatIds } } }),
        prisma.chat.deleteMany({ where: { topicId: topic.id } }),
        prisma.file.deleteMany({ where: { postId: { in: postIds } } }),
        prisma.post.deleteMany({ where: { topicId: topic.id } }),
        prisma.enrollment.deleteMany({ where: { topicId: topic.id } }),
        prisma.topic.delete({ where: { id: topic.id } }),
    ])

    return deletedTopic
}

export const editTopic = async (topic: EditTopic) => {
    return prisma.topic.update({
        where: {
            id: topic.id,
        },
        data: topic,
    })
}

// Public, unauthenticated preview for the "join via link" flow - exposes only
// non-sensitive summary fields, never members, posts or chat info.
export const getTopicPreview = async (topic: GetTopic) => {
    const result = await prisma.topic.findUnique({
        where: { id: topic.id },
        select: {
            id: true,
            title: true,
            description: true,
            ownerId: true,
            owner: { select: { name: true } },
            users: { where: { status: 'APPROVED' }, select: { id: true } },
        },
    })

    if (!result) return null

    return {
        id: result.id,
        title: result.title,
        description: result.description,
        ownerId: result.ownerId,
        ownerName: result.owner.name,
        memberCount: result.users.length,
    }
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
            chats: {
                select: { id: true },
                take: 1,
            },
        },
    })

    if (!result) return null

    return {
        ...result,
        users: result.users.map((enrollment) => enrollment.user),
        posts: result.posts,
        chatId: result.chats[0]?.id ?? null,
    }
}
