import { EditUserInput } from './user.model'
import prisma from '../../config/db'

export const editUser = async (user: EditUserInput) => {
    return prisma.user.update({where: {id: user.id}, data: user})
}