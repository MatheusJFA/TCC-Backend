import NutritionController from "@/controller/nutrition.controller";
import validateSchema from "@/middleware/validateFields";

import { Router } from "express";
import NutritionSchema from "../validation/nutrition"

const router = Router();

router.get("/mealPlan/:id",
     validateSchema(NutritionSchema.generateMealSchema),
    NutritionController.generateMealPlan);

router.get("/searchRecipe/:id",
    validateSchema(NutritionSchema.searchRecipesSchema),
    NutritionController.searchRecipes);

router.post("/addIntake/:id",
     validateSchema(NutritionSchema.addOrRemoveIntakeSchema),
    NutritionController.addIntake);

router.delete("/removeIntake/:id",
     validateSchema(NutritionSchema.addOrRemoveIntakeSchema),
    NutritionController.removeIntake);

router.post("/addWeightTracker/:id",
     validateSchema(NutritionSchema.addWeightTracker),
    NutritionController.removeIntake);

router.post("/removeWeightTracker/:id",
     validateSchema(NutritionSchema.removeWeightTracker),
    NutritionController.removeIntake);

router.get("/currentDiet/:id",
     validateSchema(NutritionSchema.getCurrentDietSchema),
    NutritionController.getCurrentDiet);

export default router;