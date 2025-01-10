import {CreateMessageSchema} from "./message.model";
import prisma from "../../config/db";

export const createMessage = async (message: CreateMessageSchema) => {
    return prisma.message.create({data: message})
}