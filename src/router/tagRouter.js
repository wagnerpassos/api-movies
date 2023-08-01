import { Router } from "express";
import TagController from "../controller/TagController.js";

const tagRouter = Router();

tagRouter.get('/', TagController);
tagRouter.get('/', TagController);
tagRouter.post('/', TagController);
tagRouter.patch('/', TagController);
tagRouter.delete('/', TagController);

export default tagRouter;