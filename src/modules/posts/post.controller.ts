import { Request, Response } from 'express'
import { createPostSchema, getSinglePostSchema } from './post.model'
import { createPost, getSinglePost } from './post.service'
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

export const handleGetSinglePost = async (req: Request, res: Response) => {
    try {
        const id = req.query['id']
        const validateData = getSinglePostSchema.parse({id})

        const post = await getSinglePost(validateData)

        return res.status(201).json(post)
    } catch (error) {
        errorHandler(res, error)
    }
}