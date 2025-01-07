import {Request, Response} from "express";
import {env} from "../config/env";

export const auth = (req: Request, res: Response, next: Function) => {
    if (req.headers['x-api-key'] !== env.API_KEY) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    next();
}