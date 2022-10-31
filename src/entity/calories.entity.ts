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

    constructor(client: Client) {
        super();
        this.user = client; 
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
                proteins: number;
                fats: number;
                carbs: number;
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

        diet = {
            proteins: macronutrients.diet.proteins,
            fats: macronutrients.diet.fats,
            carbs: macronutrients.diet.carbs
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