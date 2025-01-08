import {config} from "dotenv";

config();

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    SIGNATURE: process.env.SIGNATURE
}