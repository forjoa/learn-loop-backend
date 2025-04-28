import prisma from '../../config/db'
import { CreateUserInput, LoginUserInput } from '../users/user.model'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../lib/utils'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'

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

    return {token, user: {id: user.id, email: user.email, name: user.name, photo: user.photo, role: user.role}}
}

export const validateToken = async (token: string) => {
    try {
        // verify the token
        const decoded = jwt.verify(token, env.SIGNATURE) as { userId: number; role: string }

        // find the user by ID
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        // return user information without password
        return {
            exists: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                photo: user.photo,
                role: user.role
            }
        }
    } catch (error) {
        // if token is invalid or expired
        return {
            exists: false,
            error: 'Invalid or expired token'
        }
    }
}
