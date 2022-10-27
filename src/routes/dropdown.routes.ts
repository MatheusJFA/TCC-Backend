import { Router } from "express";
import ClientController from "@/controller/client.controller";
import NutritionController from "@/controller/nutrition.controller";
import ExerciseController from "@/controller/exercise.controller";

const router = Router();

router.get("/getSexValues", 
    ClientController.getSexValues);

router.get("/bodyPartsList",
    ExerciseController.getAllBodyParts);

router.get("/equipmentsList",
    ExerciseController.getAllEquipments);

router.get("/targetMuscleList",
    ExerciseController.getAllTargetMuscles);

router.get("/cuisineList",
    NutritionController.CuisineValues);

router.get("/intolerancesList",
    NutritionController.IntolerancesValues);

router.get("/dietsList",
    NutritionController.DietsValues);

router.get("/carbsIntakeList",
    NutritionController.CarbsIntakeValues);
    
export default router;