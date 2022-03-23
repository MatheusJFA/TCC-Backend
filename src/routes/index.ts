import { Router } from "express";

import AuthenticationRoutes from "./auth.routes";
import UserRoutes from "./user.routes";

const routes = Router();

routes.use("/auth", AuthenticationRoutes);
routes.use("/user", UserRoutes);

export default routes;
