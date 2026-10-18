// Set by the auth middleware on every protected route
declare global {
    namespace Express {
        interface Request {
            user: { userId: string; role: string }
        }
    }
}

export {}
