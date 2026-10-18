import { config } from 'dotenv'

config()

// No fallback: a default secret would make every JWT forgeable
const SIGNATURE = process.env.SIGNATURE
if (!SIGNATURE) {
    throw new Error('SIGNATURE environment variable is not set')
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    SIGNATURE,
    GEMINI_KEY: process.env.GEMINI_KEY,
}
