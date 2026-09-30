import { type EditUserInput } from './user.model.ts'
import prisma from '../../config/db.ts'

export const editUser = async (user: EditUserInput) => {
    return prisma.user.update({where: {id: user.id}, data: user})
}