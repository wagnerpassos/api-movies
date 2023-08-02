import express from "express";
import userRouter from "./router/userRouter.js";
import movieRouter from "./router/movieRouter.js";
import tagRouter from "./router/tagRouter.js";

const app = express();

const PORT = '3005';

app.use(express.json());
app.use('/user', userRouter);
app.use('/movie', movieRouter);
app.use('/tag', tagRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})