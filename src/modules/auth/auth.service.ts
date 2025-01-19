import prisma from '../../config/db'
import { CreateUserInput, LoginUserInput } from '../users/user.model'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../lib/utils'

export const createUser = async (user: CreateUserInput) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    return prisma.user.create({
        data: {
            ...user,
            password: hashedPassword
        }
    })
}

export const loginUser = async (input: LoginUserInput) => {
    // find user by email
    const user = await prisma.user.findUnique({
        where: {
            email: input.email
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!isPasswordValid) {
        throw new Error('Invalid password')
    }

    const token = generateToken(user.id, user.role)

    return {token, user: {id: user.id, email: user.email, role: user.role}}
}