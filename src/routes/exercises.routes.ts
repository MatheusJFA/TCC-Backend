import exerciseController from "@/controller/exercise.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";
import exerciseSchema from "../validation/exercise"
const router = Router();

router.get("/all",
    exerciseController.getAllExercises);

router.get("/bodyParts",
    validateSchema(exerciseSchema.bodyPartSchema),
    exerciseController.getAllExercisesByBodyPart);

router.get("/equipments",
    validateSchema(exerciseSchema.equipmentsSchema),
    exerciseController.getAllExercisesByEquipment);

router.get("/targetMuscle",
    validateSchema(exerciseSchema.targetMuscleSchema),
    exerciseController.getAllExercisesByTargetMuscle);

router.get("/bodyPartsList",
    exerciseController.getAllBodyParts);

router.get("/equipmentsList",
    exerciseController.getAllEquipments);

router.get("/targetMuscleList",
    exerciseController.getAllTargetMuscles);


export default router;