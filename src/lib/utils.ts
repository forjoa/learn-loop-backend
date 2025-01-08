import jwt from "jsonwebtoken";
import {env} from "../config/env";

export const generateToken = (userId: number, role: string) => {
    const secret = env.SIGNATURE;
    const expiresIn = "1h";

    return jwt.sign({userId, role}, secret, {expiresIn});
}