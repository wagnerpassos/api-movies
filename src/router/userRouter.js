import { Router } from "express";
import { ensureAuth } from "../middlewares/ensureAuth.js";

import multer from "multer";
import { MULTER } from "../configs/upload.js";
import UserController from "../controller/UserController.js";
import UserAvatarController from "../controller/UserAvatarController.js";

const upload = multer(MULTER)
const userRouter = Router();
const userController = new UserController();
const userAvatarController = new UserAvatarController();

userRouter.get('/', ensureAuth, userController.read);
userRouter.get('/:id', ensureAuth, userController.readById);
userRouter.post('/', userController.create);
userRouter.put('/:id', ensureAuth, userController.update);
userRouter.delete('/:id', ensureAuth, userController.delete);
userRouter.patch('/avatar/:id', ensureAuth, upload.single("avatar"), userAvatarController.update);

export default userRouter;