import { type CreateFile } from './files.model.ts'
import prisma from '../../config/db.ts'

export const createFile = async (data: CreateFile) => {
    const { filename, fileType, url, postId } = data

    return prisma.file.create({
        data: {
            filename,
            fileType,
            url,
            postId,
        },
    })
}