import { Router } from "express";
import MovieController from "../controller/MovieController.js";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.get('/', movieController.read);
movieRouter.post('/', movieController.create);
movieRouter.put('/:id', movieController.update);
movieRouter.delete('/', movieController.delete);

export default movieRouter;