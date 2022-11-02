import enviroment from "@/configuration/enviroment";
import ClientService from "@/service/client.service";
import { LogAsyncError } from "@/utils/logAsyncError";
import axios from "axios";
import { Request, Response } from "express";
import httpStatus from "http-status";

import { IntolerancesValues } from "../types/intolerance.type";
import { DietValues } from "../types/diet.type";
import { CuisineValues } from "../types/cuisine.type";
import { CarbsIntakeValues } from "@/types/carbsIntake.type";
import NutritionService from "@/service/nutrition.service";
import { getOrSetWeeklyCache } from "@/utils/cache";
import { getBMRValue, Activity } from "@/types/activity.type";

const nutritiondbURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"

class NutritionController {
    generateMealPlan = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const { excludes, activity } = request.body;

        const client = await ClientService.getClientByID(id);
        const timeFrame = 'week';
        let activityType = activity || Activity.SEDENTARY;
        const bmr = client.mifflinStJeorFormula()
        const targetCalories = getBMRValue(bmr, activityType);
        const diet = client.diet;
        const exclude = excludes || "";

        let mealPlan: any = await getOrSetWeeklyCache(`mealPlan=${id}`, async () => {
            let { data } = await axios.get(`${nutritiondbURL}/recipes/mealplans/generate`, {
                params: {
                    timeFrame,
                    targetCalories,
                    diet,
                    exclude,
                },
                headers: {
                    'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
            });

            return data;
        });


        return response.status(httpStatus.OK).send({ data: mealPlan });
    });

    getRecipes = LogAsyncError(async (request: Request, response: Response) => {
        const recipeID = request.params.id;

        const recipe = await getOrSetWeeklyCache(`recipe=${recipeID}`, async () => {
            const { data } = await axios.get(`${nutritiondbURL}/recipes/${recipeID}/information`, {
                headers: {
                    'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
            });

            return data;
        })

        return response.status(httpStatus.OK).send({ data: recipe });
    });


    addIntake = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const { calories, proteins, fats, carbs, date } = request.body.information;
        let specificDate = date || new Date();
        await NutritionService.addIntake(id, calories, proteins, fats, carbs, specificDate);

        return response.status(httpStatus.OK);
    });

    removeIntake = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const { calories, proteins, fats, carbs, date } = request.body.information;
        let specificDate = date || new Date();
        await NutritionService.removeIntake(id, calories, proteins, fats, carbs, specificDate);

        return response.status(httpStatus.OK);
    });


    addWeightTracker = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const { weight } = request.body.information;
        await NutritionService.addWeightTracker(id, weight);

        return response.status(httpStatus.OK);
    });

    removeWeightTracker = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const { weightTrackerId } = request.body.information;
        await NutritionService.removeWeightTracker(id, weightTrackerId);

        return response.status(httpStatus.OK);
    });

    getCurrentDiet = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const date = request.body;
        const specificDate = date || new Date();

        const remainingNutrition = await NutritionService.getClientRemainingNutrition(id, specificDate);

        return response.status(httpStatus.OK).send({ nutrition: remainingNutrition })
    });

    IntolerancesValues = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ IntolerancesValues });
    });

    DietsValues = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ DietValues });
    });

    CuisineValues = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ CuisineValues });
    });

    CarbsIntakeValues = LogAsyncError(async (request: Request, response: Response) => {
        return response.status(httpStatus.OK).send({ CarbsIntakeValues });
    });
}

export default new NutritionController();