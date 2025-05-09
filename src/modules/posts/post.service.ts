import prisma from '../../config/db'
import { CreatePost, GetSinglePost } from './post.model'

export const createPost = async (postData: CreatePost) => {

    console.log(postData)
    const newPost = await prisma.post.create({
        data: {
            title: postData.title,
            content: postData.content,
            topicId: postData.topicId,
            userId: postData.userId,
        },
    })


    if (postData.fileUrl) {
        const file = await prisma.file.create({
            data: {
                filename: postData.filename,
                fileType: postData.fileType,
                url: postData.fileUrl,
                postId: newPost.id,
            },
        })

        console.log(file)
    }

    const topic = await prisma.topic.findUnique({
        where: {id: postData.topicId},
        select: {title: true},
    })

    if (!topic) {
        throw new Error(`Topic with id=${postData.topicId} not found`)
    }

    const approvedEnrollments = await prisma.enrollment.findMany({
        where: {
            topicId: postData.topicId,
            status: 'APPROVED',
        },
        select: {userId: true},
    })

    const notifications = approvedEnrollments.map(({userId}) => ({
        userId,
        title: 'Nuevo post',
        content: `Se ha creado nuevo post en ${topic.title}`,
    }))

    if (notifications.length > 0) {
        await prisma.notification.createMany({
            data: notifications,
            skipDuplicates: true,
        })
    }

    return newPost
}

export const getSinglePost = async (postData: GetSinglePost) => {
    const file = await prisma.file.findFirst({
        where: {
            postId: postData.id
        }
    })

    const postInfo = await prisma.post.findUnique({
        where: {
            id: postData.id
        }
    })

    return {...postInfo, file}
}