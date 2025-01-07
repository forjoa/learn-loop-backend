import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

export default app;