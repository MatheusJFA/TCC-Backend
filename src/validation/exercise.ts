import * as Yup from 'yup';
import { bodyPartsValues, equipmentsValues, targetMusclesValues } from '@/types/exercise.type';

const bodyPartSchema = Yup.object().shape({
    body: Yup.object().shape({
        bodyPart: Yup.string().oneOf(bodyPartsValues).required()
    }).required(),
});


const equipmentsSchema = Yup.object().shape({
    body: Yup.object().shape({
        equipment: Yup.string().oneOf(equipmentsValues).required()
    }).required(),
});


const targetMuscleSchema = Yup.object().shape({
    body: Yup.object().shape({
        targetMuscle: Yup.string().oneOf(targetMusclesValues).required()
    }).required(),
});

export default {
    bodyPartSchema,
    equipmentsSchema,
    targetMuscleSchema,
}