import express from "express";

import "dotenv/config";

import userRouter from "./router/userRouter.js";
import movieRouter from "./router/movieRouter.js";
import tagRouter from "./router/tagRouter.js";
import sessionRouter from "./router/sessionsRouter.js";

import cors from "cors";

import { UPLOAD_FOLDER } from "./configs/upload.js";

const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.use('/files', express.static(UPLOAD_FOLDER));

app.use('/user', userRouter);
app.use('/movie', movieRouter);
app.use('/tag', tagRouter);
app.use('/session', sessionRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});