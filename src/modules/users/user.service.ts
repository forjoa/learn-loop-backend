import prisma from "../../config/db";
import {CreateUserInput} from "./user.model";
import bcrypt from "bcryptjs";

export const createUser = async (user: CreateUserInput) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    return prisma.user.create({
        data: {
            ...user,
            password: hashedPassword
        }
    })
}