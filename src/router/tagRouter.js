import { Router } from "express";
import TagController from "../controller/TagController.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";

const tagRouter = Router();
const tagController = new TagController();

tagRouter.use(ensureAuth);
tagRouter.get('/', tagController.read);
tagRouter.post('/', tagController.create);
tagRouter.put('/:id', tagController.update);
tagRouter.delete('/', tagController.delete);

export default tagRouter;