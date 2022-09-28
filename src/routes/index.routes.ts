import { Router } from "express";
import AuthorizationRouter from "./auth.routes";
import UserRouter from "./user.routes";

const router = Router();

router.use("/auth", AuthorizationRouter);
router.use("/user", UserRouter);

export default router;