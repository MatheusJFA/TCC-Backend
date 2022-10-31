import ExerciseController from "@/controller/exercise.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";
import exerciseSchema from "../validation/exercise"
const router = Router();


router.get("/all",
    ExerciseController.getAllExercises);

router.get("/bodyParts/:bodyPart",
    validateSchema(exerciseSchema.bodyPartSchema),
    ExerciseController.getAllExercisesByBodyPart);

router.get("/equipments",
    validateSchema(exerciseSchema.equipmentsSchema),
    ExerciseController.getAllExercisesByEquipment);

router.get("/targetMuscle",
    validateSchema(exerciseSchema.targetMuscleSchema),
    ExerciseController.getAllExercisesByTargetMuscle);



export default router;