import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
}

const adapter = new PrismaPg({ connectionString })
// password is never returned unless a query opts back in with omit: { password: false }
const prisma = new PrismaClient({ adapter, omit: { user: { password: true } } })

export default prisma
