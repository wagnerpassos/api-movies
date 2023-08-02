import { Router } from "express";
import TagController from "../controller/TagController.js";

const tagRouter = Router();
const tagController = new TagController();

tagRouter.get('/', tagController.read);
tagRouter.post('/', tagController.create);
tagRouter.put('/:id', tagController.update);
tagRouter.delete('/', tagController.delete);

export default tagRouter;