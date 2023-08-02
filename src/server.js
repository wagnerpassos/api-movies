import express from "express";
import userRouter from "./router/userRouter.js";
import movieRouter from "./router/movieRouter.js";

const app = express();

const PORT = '3005';

app.use(express.json());
app.use('/user', userRouter);
app.use('/movie', movieRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})