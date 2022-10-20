import nutritionController from "@/controller/nutrition.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";
import nutritionSchema from "../validation/nutrition"

const router = Router();

router.get("/mealPlan/:id",
    validateSchema(nutritionSchema.generateMealSchema),
    nutritionController.generateMealPlan);

router.get("/searchRecipe/:id",
    validateSchema(nutritionSchema.searchRecipesSchema),
    nutritionController.searchRecipes);

router.get("/currentDiet/:id",
    validateSchema(nutritionSchema.getCurrentDietSchema),
    nutritionController.getCurrentDiet);

router.post("/addIntake/:id",
    validateSchema(nutritionSchema.addOrRemoveIntakeSchema),
    nutritionController.addIntake);

router.post("/addIntake/:id",
    validateSchema(nutritionSchema.addOrRemoveIntakeSchema),
    nutritionController.removeIntake);

router.get("/cuisineList",
    nutritionController.CuisineValues);

router.get("/intolerancesList",
    nutritionController.IntolerancesValues);

router.get("/dietsList",
    nutritionController.DietsValues);

router.get("/carbsIntakeList",
    nutritionController.CarbsIntakeValues);

export default router;