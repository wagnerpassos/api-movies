import express from "express";
import userRouter from "./router/userRouter.js";

const app = express();

const PORT = '3005';

app.use(express.json());
app.use(userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})