import { Request, Response } from 'express'
import { createPostSchema } from './post.model'
import { createPost } from './post.service'
import { errorHandler } from '../../lib/utils'

export const handleCreatePost = async (req: Request, res: Response) => {
    try {
        const validateData = createPostSchema.parse(req.body)

        const post = await createPost(validateData)

        return res.status(201).json({
            message: 'Post created successfully',
            data: post
        })
    } catch (error) {
        errorHandler(res, error)
    }
}