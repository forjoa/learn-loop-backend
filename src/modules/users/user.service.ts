export const editUser = async (user: EditUserInput) => {
    return prisma.user.update({where: {id: user.id}, data: user})
}