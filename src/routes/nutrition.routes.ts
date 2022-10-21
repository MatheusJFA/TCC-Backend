import nutritionController from "@/controller/nutrition.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";
import NutritionSchema from "../validation/nutrition"

const router = Router();

router.get("/mealPlan/:id",
    validateSchema(NutritionSchema.generateMealSchema),
    nutritionController.generateMealPlan);

router.get("/searchRecipe/:id",
    validateSchema(NutritionSchema.searchRecipesSchema),
    nutritionController.searchRecipes);

router.post("/addIntake/:id",
    validateSchema(NutritionSchema.addOrRemoveIntakeSchema),
    nutritionController.addIntake);

router.delete("/removeIntake/:id",
    validateSchema(NutritionSchema.addOrRemoveIntakeSchema),
    nutritionController.removeIntake);

router.post("/addWeightTracker/:id",
    validateSchema(NutritionSchema.addWeightTracker),
    nutritionController.removeIntake);

router.post("/removeWeightTracker/:id",
    validateSchema(NutritionSchema.removeWeightTracker),
    nutritionController.removeIntake);

router.get("/currentDiet/:id",
    validateSchema(NutritionSchema.getCurrentDietSchema),
    nutritionController.getCurrentDiet);

router.get("/cuisineList",
    nutritionController.CuisineValues);

router.get("/intolerancesList",
    nutritionController.IntolerancesValues);

router.get("/dietsList",
    nutritionController.DietsValues);

router.get("/carbsIntakeList",
    nutritionController.CarbsIntakeValues);

export default router;