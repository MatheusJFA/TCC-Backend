import { Router } from "express";
import AuthorizationRouter from "./auth.routes";
import HelperRouter from "./helper.routes";
import ClientRouter from "./client.routes";

const router = Router();

router.use("/auth", AuthorizationRouter);
router.use("/helper", HelperRouter);
router.use("/client", ClientRouter);

export default router;