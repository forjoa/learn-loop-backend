import express from "express";
import cors from "cors";

import {auth} from "./middleware/auth";

import userRoutes from "./modules/users/user.routes";
import topicRoutes from "./modules/topics/topic.routes";
import authRoute from "./modules/auth/auth.route";
import enrollmentRoutes from "./modules/enrollments/enrollment.routes";

const app = express();

app.use(cors());
app.use(express.json());

// unprotected routes
app.use('/auth', authRoute)

// @ts-ignore
app.use(auth);

app.use('/users', userRoutes);
app.use('/topics', topicRoutes);
app.use('/enrollment', enrollmentRoutes);

export default app;