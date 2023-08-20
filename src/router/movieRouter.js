import { Router } from "express";
import MovieController from "../controller/MovieController.js";
import { ensureAuth } from "../middlewares/ensureAuth.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.use(ensureAuth);
movieRouter.get('/', movieController.read);
movieRouter.get('/:id', movieController.readById);
movieRouter.post('/', movieController.create);
movieRouter.put('/:id', movieController.update);
movieRouter.delete('/', movieController.delete);

export default movieRouter;