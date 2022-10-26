import nutritionController from "@/controller/nutrition.controller";
import validateSchema from "@/middleware/validateFields";
import { validID } from "@/middleware/validID";
import { Router } from "express";
import NutritionSchema from "../validation/nutrition"

const router = Router();

router.get("/mealPlan/:id",
    validID,
    validateSchema(NutritionSchema.generateMealSchema),
    nutritionController.generateMealPlan);

router.get("/searchRecipe/:id",
    validID,
    validateSchema(NutritionSchema.searchRecipesSchema),
    nutritionController.searchRecipes);

router.post("/addIntake/:id",
    validID,
    validateSchema(NutritionSchema.addOrRemoveIntakeSchema),
    nutritionController.addIntake);

router.delete("/removeIntake/:id",
    validID,
    validateSchema(NutritionSchema.addOrRemoveIntakeSchema),
    nutritionController.removeIntake);

router.post("/addWeightTracker/:id",
    validID,
    validateSchema(NutritionSchema.addWeightTracker),
    nutritionController.removeIntake);

router.post("/removeWeightTracker/:id",
    validID,
    validateSchema(NutritionSchema.removeWeightTracker),
    nutritionController.removeIntake);

router.get("/currentDiet/:id",
    validID,
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