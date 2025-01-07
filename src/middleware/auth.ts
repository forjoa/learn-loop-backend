import {Request, Response} from "express";

export const auth = (req: Request, res: Response, next: Function) => {
    console.log(req.headers['x-api-key']);
    next();
}