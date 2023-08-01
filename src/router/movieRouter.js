import { Router } from "express";
import MovieRouter from "../controller/MovieRouter.js";

const movieRouter = Router();

movieRouter.get('/', MovieRouter);
movieRouter.get('/', MovieRouter);
movieRouter.post('/', MovieRouter);
movieRouter.patch('/', MovieRouter);
movieRouter.delete('/', MovieRouter);

export default movieRouter;