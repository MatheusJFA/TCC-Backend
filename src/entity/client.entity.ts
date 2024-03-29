import { getBMRValues, getBMRWeeklyValues } from "@/types/activity.type";
import { getBMIName } from "@/types/bmi.type";
import { CarbsIntake, CarbsIntakeValues } from "@/types/carbsIntake.type";
import { DietType, DietTypeValues } from "@/types/dietType.type";
import { Intolerances, IntolerancesValues } from "@/types/intolerance.type";
import { Diet, DietValues } from "@/types/diet.type";
import { Sex } from "@/types/sex.type";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import Calories, { ICaloriesConsumption } from "./calories.entity";
import Helper from "./helper.entity";
import User from "./user.entity";
import WeightTracker from "./weightTracker.entity";
import Token from "./token.entity";

export interface IClient {
    id: string,
    height: number,
    weight: number,
    calories: Calories[],
    carbsIntake: string
}

@Entity("clients")
export default class Client extends User implements IClient {
    @ManyToMany(() => Helper, helper => helper.clients)
    helpers: Helper[];

    @Column("decimal")
    height: number;

    @Column("decimal")
    weight: number;

    @OneToMany(() => Calories, calories => calories.user, { eager: true, cascade: true })
    calories: Calories[];

    @OneToMany(() => WeightTracker, weightTracker => weightTracker.client, { eager: true, cascade: true })
    weightTracker: WeightTracker[];

    @Column("enum", { enum: CarbsIntakeValues })
    carbsIntake: string;

    @Column("enum", { enum: DietTypeValues })
    dietType: string;

    @Column("enum", { enum: DietValues })
    diet: string;

    @Column("enum", { enum: IntolerancesValues })
    intolerance: string;

    @OneToMany(() => Token, token => token.client, { eager: true, cascade: true })
    tokens: Token[];

    constructor(
        name: string,
        email: string,
        password: string,
        birthdate: Date,
        sex: string,
        role: string,
        height: number,
        weight: number,
        image?: string,
    ) {
        super(name, email, password, birthdate, sex, role, image);
        this.height = height;
        this.weight = weight;
        this.diet = Diet.NO_DIET;
        this.dietType = DietType.MAINTENANCE;
        this.intolerance = Intolerances.NONE;
        this.carbsIntake = CarbsIntake.MODERATE_INTAKE;
    }

    //Constants
    FEET_RATIO = 30.48;
    INCH_RATIO = 12;
    FIVE_FEET = 5.00;
    
    BULKING = 500;
    CUTTING = 500;

    PROTEINS_CALORIES = 4;
    FATS_CALORIES = 9;
    CARBS_CALORIES = 4;

    addToken = (token: Token): void => {
        if (!this.tokens)
            this.tokens = new Array<Token>();

        this.tokens.push(token);
    }

    addHelper = (helper: Helper): void => {
        if (!this.helpers) this.helpers = new Array<Helper>();
        this.helpers.push(helper);
    }

    removeHelper = (helper: Helper): void => {
        if (!this.helpers) this.helpers = new Array<Helper>();
        this.helpers = this.helpers.filter(h => h.id !== helper.id);
    }

    addWeightToTracker = (value: WeightTracker) => {
        if (!this.weightTracker) this.weightTracker = new Array<WeightTracker>();
        this.weightTracker.push(value);
    }

    removeWeightFromTracker = (id: string) => {
        if (!this.weightTracker) this.weightTracker = new Array<WeightTracker>();
        this.weightTracker = this.weightTracker.filter(tracker => tracker.id == id);
    }

    addIntake = (value: ICaloriesConsumption, specificDate: Date = new Date()) => {
        if (!this.calories) this.calories = new Array<Calories>();
        const todaysCalories = this.calories.filter(calorie => calorie.createdAt.toDateString() === specificDate.toDateString())[0];
        todaysCalories.addCalories(value);
    }

    removeIntake = (value: ICaloriesConsumption, specificDate: Date = new Date()) => {
        if (!this.calories) this.calories = new Array<Calories>();
        const todaysCalories = this.calories.filter(calorie => calorie.createdAt.toDateString() === specificDate.toDateString())[0];
        todaysCalories.removeCalories(value);
    }

    updateClient = (client: Partial<Omit<IClient, "password">>) => {
        Object.assign(this, client);
    }

    updateHeightAndWeight = (height: number, weight: number): void => {
        this.weight = weight;
        this.height = height;
    }

    //Ìndice de Massa corporal
    //Body Mass Index
    calculateBMI(): { value: number, text: string } {
        const value = this.weight / (this.height * this.height);
        const text = getBMIName(value);

        return { value, text };
    }

    //Ideal Body Weight 
    //Peso corporal ideal
    IBW_DRMillerFormula = (): number => {
        const cm = this.height * 100;
        const overFiveFeetToInches = this.inchesOverFiveFeet(cm);

        const male = 56.2 + 1.41 * overFiveFeetToInches;
        const female = 53.1 + 1.36 * overFiveFeetToInches;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    IBW_JDRobinsonFormula = (): number => {
        const cm = this.height * 100;
        const overFiveFeetToInches = this.inchesOverFiveFeet(cm);

        const male = 52 + 1.9 * overFiveFeetToInches;
        const female = 49 + 1.7 * overFiveFeetToInches;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    IBW_BJDevineFormula = (): number | number[] => {
        const cm = this.height * 100;
        const overFiveFeetToInches = this.inchesOverFiveFeet(cm);

        const male = 50 + 2.3 * overFiveFeetToInches;
        const female = 45.5 + 2.3 * overFiveFeetToInches;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    IBW_HanwiFormula = (): number => {
        const cm = this.height * 100;
        const overFiveFeetToInches = this.inchesOverFiveFeet(cm);

        const male = 48 + 2.7 * overFiveFeetToInches;
        const female = 45.5 + 2.2 * overFiveFeetToInches;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    inchesOverFiveFeet = (cm: number) => {
        const feet = cm / this.FEET_RATIO;
        const overFiveFeet = feet - this.FIVE_FEET;
        const overFiveFeetToInches = overFiveFeet * this.INCH_RATIO;

        return overFiveFeetToInches;
    }

    IBW_Range = () => {
        const hanwi = this.IBW_HanwiFormula();
        const miller = this.IBW_DRMillerFormula();
        const devine = this.IBW_BJDevineFormula();
        const robinson = this.IBW_JDRobinsonFormula();

        const { values } = this.getMinimunAndMaximunValues([hanwi, miller, devine, robinson]);

        return { minimun: Math.min(...values), maximun: Math.max(...values) }
    }

    getMinimunAndMaximunValues = (calculus: Array<any>) => {
        const values = new Array<number>();

        calculus.map(value => values.push(value));

        return { values };
    }

    // Basal Metabolic Rate 
    // Taxa metabólica basal
    // Most Accurate  
    mifflinStJeorFormula = (): number => {
        const kg = this.weight;
        const cm = this.height * 100;
        const age = new Date().getFullYear() - this.birthdate.getFullYear();

        const female = 10 * kg + 6.25 * cm - 5 * age - 161;
        const male = 10 * kg + 6.25 * cm - 5 * age + 5;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    harrisBenedictFormula = (): number => {
        const kg = this.weight;
        const cm = this.height * 100;
        const age = new Date().getFullYear() - this.birthdate.getFullYear();

        const female = 9.247 * kg + 3.098 * cm - 4.330 * age + 447.593;
        const male = 13.397 * kg + 4.799 * cm - 5.677 * age + 88.362;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    katchMcArdleFormula = (): number => {
        const fatPercentage = this.fatPercentage();
        return 370 + 21.6 * (1 - fatPercentage / 100) * this.weight;
    }

    //Fat percentage
    fatPercentage = (): number => {
        const age = new Date().getFullYear() - this.birthdate.getFullYear();
        const BMI = this.calculateBMI().value;

        const female = 1.20 * BMI + 0.23 * age - 5.4;
        const male = 1.20 * BMI + 0.23 * age - 16.2;

        if (this.sex === Sex.MALE) return male;
        else return female;

    }

    //Maximum Muscular Potential
    //Potencia Máxima Muscular 
    //Martin Berkhan Formula → 5~6% body fat
    MMPCalculation = () => {
        const MAXIMUN = 98; // 189 - 98 = 91kg
        const MINIMUN = 102; // 189  - 102 = 87kg
        const cm = this.height * 100;

        return {
            minimun: cm - MINIMUN,
            maximun: cm - MAXIMUN
        }
    }

    //Basal metabolic rate
    //Taxa metabólica basal
    BMRCalculation = (): number => {
        const kg = this.weight;
        const cm = this.height * 100;
        const age = new Date().getFullYear() - this.birthdate.getFullYear();

        const female = 655 + (9.6 * kg) + (1.8 * cm) - (4.7 * age);
        const male = 66 + (13.7 * kg) + (5 * cm) - (6.8 * age);

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    BMRCalculationBaseOnActivity = (): Object => {
        const bmr = this.BMRCalculation();
        return getBMRValues(bmr);
    }

    BMRCalculationBaseOnMillerFormula = (): Object => {
        const bmr = this.mifflinStJeorFormula();
        return getBMRValues(bmr);
    }

    BMRCalculationBaseOnMillerWeeklyFormula = (): Object => {
        const bmr = this.mifflinStJeorFormula();
        return getBMRWeeklyValues(bmr);
    }

    //Macronutrients Calculations
    getBMRForMaintainceCuttingBulkingDiets = (): {
        maintaince: number,
        cutting: number,
        bulking: number,
    } => {
        const values = this.mifflinStJeorFormula();

        let diets: {
            maintaince: number,
            cutting: number,
            bulking: number,
        };

        diets = {
            maintaince: values,
            cutting: values - this.CUTTING,
            bulking: values + this.BULKING,
        };

        return diets;
    }

    //30% protein, 35% fats, 35% carbs
    MNC_NormalCarb = () => {
        const PROTEINS_PERCENTAGE = 0.30;
        const FATS_PERCENTAGE = 0.35;
        const CARBS_PERCENTAGE = 0.35;

        const diet = this.getBMRForMaintainceCuttingBulkingDiets();


        return {
            diet: this.getMacronutrientsValues(diet, PROTEINS_PERCENTAGE, FATS_PERCENTAGE, CARBS_PERCENTAGE)
        }
    }

    //40% protein, 40% fats, 20% carbs
    MNC_LowCarb = () => {
        const PROTEINS_PERCENTAGE = 0.40;
        const FATS_PERCENTAGE = 0.40;
        const CARBS_PERCENTAGE = 0.20;

        const diet = this.getBMRForMaintainceCuttingBulkingDiets();

        return {
            diet: this.getMacronutrientsValues(diet, PROTEINS_PERCENTAGE, FATS_PERCENTAGE, CARBS_PERCENTAGE)
        }
    }

    //30% protein, 20% fats, 50% carbs
    MNC_HighCarb = () => {
        const PROTEINS_PERCENTAGE = 0.30;
        const FATS_PERCENTAGE = 0.20;
        const CARBS_PERCENTAGE = 0.50;

        const diet = this.getBMRForMaintainceCuttingBulkingDiets();

        return {
            diet: this.getMacronutrientsValues(diet, PROTEINS_PERCENTAGE, FATS_PERCENTAGE, CARBS_PERCENTAGE)
        }

    }

    getMacronutrientsValues = (value: { maintaince: number, cutting: number, bulking: number }, PROTEINS_PERCENTAGE: number, FATS_PERCENTAGE: number, CARBS_PERCENTAGE: number) => {

        const proteins_maintaince = Math.ceil((value.maintaince * PROTEINS_PERCENTAGE) / this.PROTEINS_CALORIES);
        const fats_maintaince = Math.ceil((value.maintaince * FATS_PERCENTAGE) / this.FATS_CALORIES);
        const carbs_maintaince = Math.ceil((value.maintaince * CARBS_PERCENTAGE) / this.CARBS_CALORIES);

        const proteins_bulking = Math.ceil((value.bulking * PROTEINS_PERCENTAGE) / this.PROTEINS_CALORIES);
        const fats_bulking = Math.ceil((value.bulking * FATS_PERCENTAGE) / this.FATS_CALORIES);
        const carbs_bulking = Math.ceil((value.bulking * CARBS_PERCENTAGE) / this.CARBS_CALORIES);

        const proteins_cutting = Math.ceil((value.cutting * PROTEINS_PERCENTAGE) / this.PROTEINS_CALORIES);
        const fats_cutting = Math.ceil((value.cutting * FATS_PERCENTAGE) / this.FATS_CALORIES);
        const carbs_cutting = Math.ceil((value.cutting * CARBS_PERCENTAGE) / this.CARBS_CALORIES);

        if (this.dietType === DietType.BULKING)
            return {
                proteins: proteins_bulking,
                fats: fats_bulking,
                carbs: carbs_bulking
            }
        else if (this.dietType === DietType.CUTTING)
            return {
                proteins: proteins_cutting,
                fats: fats_cutting,
                carbs: carbs_cutting
            }
        else
            return {
                proteins: proteins_maintaince,
                fats: fats_maintaince,
                carbs: carbs_maintaince
            }
    }

    //Lean Body Mass
    //Massa corporal magra
    LBM_BoerFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;

        const male = (0.407 * kg) + (0.267 * cm) - 19.2;
        const female = (0.252 * kg) + (0.473 * cm) - 48.3;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    LBM_JamesFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;

        const male = (1.1 * kg) - (128 * ((kg * kg) / (cm * cm)));
        const female = (1.07 * kg) - (148 * ((kg * kg) / (cm * cm)));

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    LBM_HumeFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;

        const male = (0.32810 * kg) + (0.33929 * cm) - 29.5336;
        const female = (0.29569 * kg) + (0.41813 * cm) - 43.2933;

        if (this.sex === Sex.MALE) return male;
        else return female;
    }

    getAllHealthData = () => {
        let data: any = {};

        const BMI = this.calculateBMI(); // Body Mass Index

        const BMR = { //Basal metabolic rate
            base: this.BMRCalculation(),
            weekly: this.BMRCalculationBaseOnMillerWeeklyFormula(),
            mifflinStJeor: this.mifflinStJeorFormula(),
            harrisBenedict: this.harrisBenedictFormula(),
            katchMcArdle: this.katchMcArdleFormula(),
        };

        const BMR_ACTIVITY = { //Basal metabolic rate during activities
            base: this.BMRCalculationBaseOnActivity(),
            mifflin: this.BMRCalculationBaseOnMillerFormula()
        };

        const IBW = { //Ideal body weight
            hanwi: this.IBW_HanwiFormula(),
            miller: this.IBW_DRMillerFormula(),
            devine: this.IBW_BJDevineFormula(),
            robinson: this.IBW_JDRobinsonFormula(),
            range: this.IBW_Range()
        };

        const MMP = this.MMPCalculation();  //Maximum Muscular Potential

        const fatPercentage = this.fatPercentage(); //Fat percentage

        const MNC = { //Macronutrients Calculations
            normal: this.MNC_NormalCarb(),
            high: this.MNC_HighCarb(),
            low: this.MNC_LowCarb()
        };

        const LBM = { // Lean Body Mass
            boer: this.LBM_BoerFormula(),
            hume: this.LBM_HumeFormula(),
            james: this.LBM_JamesFormula()
        };

        let macronutrients;

        if (this.carbsIntake === CarbsIntake.LOW_INTAKE)
            macronutrients = MNC.low;
        else if (this.carbsIntake === CarbsIntake.HIGH_INTAKE)
            macronutrients = MNC.high;
        else macronutrients = MNC.normal;

        data.BMI = BMI; 
        data.BMR = BMR;
        data.BMR_ACTIVITY = BMR_ACTIVITY;
        data.IBW = IBW;
        data.MMP = MMP;
        data.fatPercentage = fatPercentage;
        data.MNC = macronutrients;
        data.LBM = LBM;

        return data;
    }

    toJSON = (): {
        id: string;
        name: string;
        email: string;
        birthdate: Date;
        height: number;
        weight: number;
        role: string;
        sex: string;
        image?: string;
    } => {
        const { id, name, email, birthdate, role, sex, image, weight, height } = this;

        const client = {
            id,
            name: name,
            email: email,
            birthdate: new Date(birthdate),
            height,
            weight,
            role: role,
            sex: sex,
            image: image,
        }

        return client;
    }

}