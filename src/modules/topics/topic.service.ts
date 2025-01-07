import prisma from "../../config/db";
import {CreateTopicInput} from "./topic.model";

export const createTopic = async (topic: CreateTopicInput) => {
    return prisma.topic.create({data: topic})
}