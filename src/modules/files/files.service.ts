import { CreateFile } from './files.model'
import prisma from '../../config/db'

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