
import enviroment from "@/configuration/enviroment";
import { bodyPartsValues, targetMusclesValues, equipmentsValues, validBodyPart, validEquipment, validTargetMuscle } from "@/types/exercise.type";
import { getOrSetLongCache } from "@/utils/cache";
import { LogAsyncError } from "@/utils/logAsyncError";
import axios from "axios";
import { Request, Response } from "express";
import httpStatus from "http-status";

const exercisedbURL = "https://exercisedb.p.rapidapi.com";

class ExerciseController {
    getAllExercises = LogAsyncError(async (request: Request, response: Response) => {

        const exerciseList = getOrSetLongCache(`exerciseList`, async () => {
            const { data } = await axios.get(`${exercisedbURL}/exercises`, {
                headers: {
                    'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                }
            });

            return data;
        });

        response.status(httpStatus.OK).send({ exerciseList });
    });

    getAllExercisesByEquipment = LogAsyncError(async (request: Request, response: Response) => {
        const equipment = request.params.equipment;
        if (validEquipment(equipment)) {
            const exerciseList = getOrSetLongCache(`exerciseList`, async () => {
                const { data } = await axios.get(`${exercisedbURL}/exercises`, {
                    headers: {
                        'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                    }
                });

                return data.map((item: any) => item.equipment === equipment);
            });

            response.status(httpStatus.OK).send({ exerciseList });
        } else return response.status(httpStatus.BAD_REQUEST).send({ message: `Invalid option` })
    });

    getAllExercisesByBodyPart = LogAsyncError(async (request: Request, response: Response) => {

        const bodyPart = request.params.bodyPart;
        if (validBodyPart(bodyPart)) {
            const exerciseList = getOrSetLongCache(`exerciseList`, async () => {
                const { data } = await axios.get(`${exercisedbURL}/exercises`, {
                    headers: {
                        'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                    }
                });

                return data.map((item: any) => item.bodyPart === bodyPart);
            });

            response.status(httpStatus.OK).send({ exerciseList });
        } else return response.status(httpStatus.BAD_REQUEST).send({ message: `Invalid option` })
    });

    getAllExercisesByTargetMuscle = LogAsyncError(async (request: Request, response: Response) => {
        const targetMuscle = request.params.targetMuscle;

        if (validTargetMuscle(targetMuscle)) {
            const exerciseList = getOrSetLongCache(`exerciseList`, async () => {
                const { data } = await axios.get(`${exercisedbURL}/exercises`, {
                    headers: {
                        'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                    }
                });

                return data.map((item: any) => item.target === targetMuscle);
            });

            return response.status(httpStatus.OK)
                .send({ exerciseList });
        } else return response.status(httpStatus.BAD_REQUEST).send({ message: `Invalid option` })
    });

    getAllBodyParts = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ bodyPartsValues });
    });

    getAllEquipments = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ equipmentsValues });
    });

    getAllTargetMuscles = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ targetMusclesValues });
    });
}

export default new ExerciseController();


