import { CarbsIntake } from "@/types/carbsIntake.type";
import { DietType } from "@/types/dietType.type";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import Base from "./base.entity";
import Client from "./client.entity";

export interface ICaloriesConsumption {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
}

@Entity("calories")
export default class Calories extends Base implements ICaloriesConsumption {
    @Column()
    calories: number;

    @Column()
    proteins: number;

    @Column()
    fats: number;

    @Column()
    carbs: number;

    @ManyToOne(() => Client, user => user.calories)
    user: Client;

    constructor() {
        super();
        this.calories = 0;
        this.proteins = 0;
        this.fats = 0;
        this.carbs = 0;
    }

    addCalories = (value: ICaloriesConsumption) => {
        this.calories += value.calories;
        this.proteins += value.proteins;
        this.fats += value.fats;
        this.carbs += value.carbs;
    }

    removeCalories = (value: ICaloriesConsumption) => {
        this.calories -= value.calories;
        this.proteins -= value.proteins;
        this.fats -= value.fats;
        this.carbs -= value.carbs;
    }

    resetCaloriesConsumption = () => {
        this.calories = 0;
        this.proteins = 0;
        this.fats = 0;
        this.carbs = 0;
    }

    getRemainingNutrition = () => {
        const totalCalories = this.user.mifflinStJeorFormula();
        let macronutrients: {
            diet: {
                proteins_maintaince: number;
                proteins_cutting: number;
                proteins_bulking: number;
                fats_maintaince: number;
                fats_cutting: number;
                fats_bulking: number;
                carbs_maintaince: number;
                carbs_cutting: number;
                carbs_bulking: number;
            }
        };

        let diet: {
            proteins: number;
            fats: number;
            carbs: number;
        };

        if (this.user.carbsIntake === CarbsIntake.MODERATE_INTAKE) macronutrients = this.user.MNC_NormalCarb();
        else if (this.user.carbsIntake === CarbsIntake.HIGH_INTAKE) macronutrients = this.user.MNC_HighCarb();
        else macronutrients = this.user.MNC_LowCarb();

        if (this.user.diet === DietType.MAINTENANCE) 
        diet = {
            proteins: macronutrients.diet.proteins_maintaince,
            fats: macronutrients.diet.fats_maintaince,
            carbs: macronutrients.diet.carbs_maintaince
        }
        
        else if (this.user.diet === DietType.CUTTING) 
            diet = {
                proteins: macronutrients.diet.proteins_cutting,
                fats: macronutrients.diet.fats_cutting,
                carbs: macronutrients.diet.carbs_cutting,
            }

        else
            diet = {
                proteins: macronutrients.diet.proteins_bulking,
                fats: macronutrients.diet.fats_bulking,
                carbs: macronutrients.diet.carbs_bulking,
            }

        const remainaingCalores = totalCalories - this.calories;
        const remainaingProteins = diet.proteins - this.proteins;
        const remainaingFats = diet.fats - this.fats;
        const remainaingCarbs = diet.carbs - this.carbs;

        return {
            totalCalories,
            remainaing: {
                calores: remainaingCalores,
                proteins: remainaingProteins,
                fats: remainaingFats,
                carbs: remainaingCarbs,
            }
        }

    }
}