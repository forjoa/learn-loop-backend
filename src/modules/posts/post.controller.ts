import type { Request, Response } from 'express'
import { assertPostAccess, assertTopicOwner } from '../../lib/access.ts'
import { errorHandler } from '../../lib/utils.ts'
import { createPostSchema, getSinglePostSchema } from './post.model.ts'
import { createPost, getSinglePost } from './post.service.ts'

export const handleCreatePost = async (req: Request, res: Response) => {
    try {
        const validateData = createPostSchema.parse({ ...req.body, userId: req.user.userId })
        await assertTopicOwner(validateData.topicId, req.user.userId)

        const post = await createPost(validateData)

        return res.status(201).json({
            message: 'Post created successfully',
            data: post,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

export const handleGetSinglePost = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const validateData = getSinglePostSchema.parse({ id })
        await assertPostAccess(validateData.id, req.user.userId)

        const post = await getSinglePost(validateData)

        return res.status(201).json(post)
    } catch (error) {
        errorHandler(res, error)
    }
}
