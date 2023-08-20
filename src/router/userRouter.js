import { Router } from "express";
import UserController from "../controller/UserController.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', ensureAuth, userController.read);
userRouter.get('/:id', ensureAuth, userController.readById);
userRouter.post('/', userController.create);
userRouter.put('/:id', ensureAuth, userController.update);
userRouter.delete('/:id', ensureAuth, userController.delete);

export default userRouter;