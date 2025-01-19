import { config } from 'dotenv'

config()

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    SIGNATURE: process.env.SIGNATURE || 'abcd'
}