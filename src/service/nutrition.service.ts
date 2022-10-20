import { t } from "i18next";
import ApiError from "@/utils/apiError";
import Database from "@/configuration/database";
import Client from "@/entity/client.entity";
import Certification from "@/entity/certification.entity";
import Calories, { ICaloriesConsumption } from "@/entity/calories.entity";
import ClientService from "./client.service";
import httpStatus from "http-status";

const NutritionService = Database.getRepository(Calories).extend({
    addIntake: async function (id: string, calories: number, proteins: number, fats: number, carbs: number) {
        const client = await ClientService.getClientByID(id);

        if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
        client.calories.addCalories({ calories, proteins, fats, carbs } as ICaloriesConsumption);

        return await ClientService.save(client);
    },

    removeIntake: async function (id: string, calories: number, proteins: number, fats: number, carbs: number,) {
        const client = await ClientService.getClientByID(id);
        if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));

        client.calories.removeCalories({ calories, proteins, fats, carbs } as ICaloriesConsumption);

        return await ClientService.save(client);
    },

    
    getClientRemainingNutrition: async function (id: string) {
        const client = await ClientService.getClientByID(id);
        if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));

        return client.calories.getRemainingNutrition();
    }
});

export default NutritionService;