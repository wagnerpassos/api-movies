import { Router } from "express";
import UserController from "../controller/UserController.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.read);
userRouter.post('/', userController.create);
userRouter.put('/', userController.update);
userRouter.delete('/', userController.delete);

export default userRouter;