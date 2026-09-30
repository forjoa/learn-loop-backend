import prisma from '../../config/db.ts'
import type { EditUserInput } from './user.model.ts'

export const editUser = async (user: EditUserInput) => {
    return prisma.user.update({ where: { id: user.id }, data: user })
}
