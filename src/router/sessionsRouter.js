import { Router } from "express";
import SessionsController  from "../controller/SessionsController.js";

const sessionsController = new SessionsController();
const sessionsRouter = new Router();

sessionsRouter.post("/", sessionsController.create);

export default sessionsRouter;