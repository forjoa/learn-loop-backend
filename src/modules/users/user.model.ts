import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["TEACHER", "STUDENT"]).default("STUDENT")
})

export type CreateUserInput = z.infer<typeof createUserSchema>