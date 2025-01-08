import jwt from "jsonwebtoken";

export const generateToken = (userId: number, role: string) => {
    const secret = "super_secret";
    const expiresIn = "1h";

    return
}