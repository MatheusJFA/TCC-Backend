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
import { getOrSetCache } from "@/utils/cache";
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

        let mealPlan: any = await getOrSetCache(`mealPlan=${id}`, async () => {
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


        const recipe = await this.getRecipes(mealPlan);


        mealPlan.items.forEach((element: any, index: number) => {
            element.recipe = recipe[index];
        })

        return response.status(httpStatus.OK).send({ data: mealPlan });
    });

    getRecipes = (async (mealPlan: any) => {
        const recipes: any[] = [];

        recipes.push(mealPlan.items.map(async (element: any) => {
            await getOrSetCache(`recipe=${JSON.parse(element.value).id}`, async () => {
                const { data } = await axios.get(`${nutritiondbURL}/recipes/${JSON.parse(element.value).id}/information`, {
                    headers: {
                        'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                    }
                });

                return { data };
            })
        }));

        console.log({ recipes })
        return recipes;
    });


    searchRecipes = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;

        const client = await ClientService.getClientByID(id);

        const { query, cuisine, excludeCuisine, includeIngredients, excludeIngredients } = request.body.consult;

        const diet = client.diet;
        const intolerances = client.intolerance;
        const equipment = "";
        const sort = 'calories';
        const sortDirection = 'asc';
        const offset = '0';
        const number = '10';
        const limitLicense = 'false';
        const ranking = '2';

        const { data } = await axios.get(`${nutritiondbURL}/recipes/complexSearch`, {
            params: {
                query,
                cuisine,
                excludeCuisine,
                diet,
                intolerances,
                equipment,
                includeIngredients,
                excludeIngredients,
                sort,
                sortDirection,
                offset,
                number,
                limitLicense,
                ranking,
            },
            headers: {
                'X-RapidAPI-Key': enviroment.api.rapidapi.key,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        });

        return response.status(httpStatus.OK).send({ data });
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