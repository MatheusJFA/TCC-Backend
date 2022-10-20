import { t } from "i18next";
import ApiError from "@/utils/apiError";
import Database from "@/configuration/database";
import Calories, { ICaloriesConsumption } from "@/entity/calories.entity";
import ClientService from "./client.service";
import httpStatus from "http-status";

const NutritionService = Database.getRepository(Calories).extend({
    addIntake: async function (id: string, calories: number, proteins: number, fats: number, carbs: number, specificDate: Date = new Date()) {
        const client = await ClientService.getClientByID(id);

        if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
        const date = specificDate;
        client.addIntake({ calories, proteins, fats, carbs } as ICaloriesConsumption);

        return await ClientService.save(client);
    },


    removeIntake: async function (id: string, calories: number, proteins: number, fats: number, carbs: number, specificDate: Date = new Date()) {
        const client = await ClientService.getClientByID(id);
        if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
        const date = specificDate;
        client.removeIntake({ calories, proteins, fats, carbs } as ICaloriesConsumption, date);

        return await ClientService.save(client);
    },


    getClientRemainingNutrition: async function (id: string, specificDate: Date = new Date()) {
        const client = await ClientService.getClientByID(id);

        const date = specificDate;
        if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
        const getTodayCalorie = client.calories.filter(calorie => calorie.createdAt === date)[0];
        return getTodayCalorie.getRemainingNutrition();
    },

});

export default NutritionService;