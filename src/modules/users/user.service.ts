import {EditUserInput} from "./user.model";

export const editUser = async (user: EditUserInput) => {
    return prisma.user.update({where: {id: user}, data: user})
}