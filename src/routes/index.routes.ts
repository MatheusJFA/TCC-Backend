import { Router } from "express";
import AuthorizationRouter from "./auth.routes";
import ClientRouter from "./client.routes";
import HelperRouter from "./helper.routes";


const router = Router();

router.use("/auth", AuthorizationRouter);
router.use("/client", ClientRouter);
router.use("/helper", HelperRouter);

export default router;