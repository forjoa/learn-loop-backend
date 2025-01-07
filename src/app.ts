import express from "express";
import cors from "cors";

import {auth} from "./middleware/auth";

import userRoutes from "./modules/users/user.routes";
import topicRoutes from "./modules/topics/topic.routes";

const app = express();

app.use(cors());
app.use(express.json());
// @ts-ignore
app.use(auth);

app.use('/users', userRoutes);
app.use('/topics', topicRoutes);

export default app;