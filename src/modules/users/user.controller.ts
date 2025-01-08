import {Request, Response} from "express";
import {createUserSchema, loginUserSchema} from "./user.model";
import {createUser, loginUser} from "./user.service";

export const handleCreateUser = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const validateData = createUserSchema.parse(req.body);

        // call service to create user
        const user = await createUser(validateData);

        return res.status(201).json({
            message: 'User created successfully',
            data: user
        })
    } catch (error) {
        if (error instanceof Error && 'issues' in error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.issues
            })
        }

        return res.status(500).json({message: 'Internal server error'})
    }
}

export const handleLogin = async (req: Request, res: Response) => {
    try {
        // validate request body using zod
        const input = loginUserSchema.parse(req.body);

        // call service to create user
        const user = await loginUser(input);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: 'Internal server error'})
    }
}