import { Router } from "express";
import UserController from "../controller/UserController.js";

const userRouter = Router();

userRouter.get('/', UserController);
userRouter.get('/', UserController);
userRouter.post('/', UserController);
userRouter.patch('/', UserController);
userRouter.delete('/', UserController);

export default userRouter;