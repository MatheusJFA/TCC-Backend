import { Router } from "express";
import AuthorizationRouter from "./auth.routes";
import HelperRouter from "./helper.routes";
import ClientRouter from "./client.routes";
import ExercisesRouter from "./exercises.routes";
import NutritionRouter from "./nutrition.routes";
import DropdownRouter from "./dropdown.routes";

const router = Router();

router.use("/auth", AuthorizationRouter);
router.use("/helper", HelperRouter);
router.use("/drop", DropdownRouter);
router.use("/client", ClientRouter);
router.use("/exercise", ExercisesRouter);
router.use("/nutrition", NutritionRouter);

export default router;