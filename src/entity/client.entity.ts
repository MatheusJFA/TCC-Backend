import { getBMRValues } from "@/types/activity.type";
import { BMI, getBMIName } from "@/types/bmi.type";
import { Sex } from "@/types/sex.type";
import client from "@/validation/client";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Helper from "./helper.entity";
import User from "./user.entity";

export interface IClient {
    id: string,
    user: User,
    height: number,
    weight: number,
}

@Entity("clients")
export default class Client implements IClient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User, user => user.id)
    user: User;

    @ManyToMany(() => Helper, helper => helper.clients)
    helpers: Helper[];

    @Column("decimal")
    height: number;

    @Column("decimal")
    weight: number;

    constructor(
        user: User,
        height: number,
        weight: number,

    ) {
        this.user = user;
        this.height = height;
        this.weight = weight;
    }

    FEET_RATIO = 30.48;
    INCH_RATIO = 12;
    FIVE_FEET = 5.00;

    addHelper = (helper: Helper): void => {
        if (!this.helpers) this.helpers = new Array<Helper>();
        this.helpers.push(helper);
    }

    removeHelper = (helper: Helper): void => {
        if (!this.helpers) this.helpers = new Array<Helper>();
        this.helpers = this.helpers.filter(h => h.user.id !== helper.user.id);
    }

    updateClient = (client: Partial<Omit<IClient, "password">>) => {
        Object.assign(this, client);
    }

    //Ìndice de Massa corporal
    //Body Mass Index
    calculateBMI = (): { value: number, text: string } => {
        const value = this.weight / (this.height * this.height);
        const text = getBMIName(value);

        return { value, text };
    }

    //Ideal Body Weight 
    //Peso corporal ideal
    IBW_DRMillerFormula = (): number | number[] => {
        const cm = this.height * 100;

        const feet = cm / this.FEET_RATIO;
        const overFiveFeet = feet - this.FIVE_FEET;
        const overFiveFeetToInches = overFiveFeet * this.INCH_RATIO;

        const male = 56.2 + 1.41 * overFiveFeetToInches;
        const female = 53.1 + 1.36 * overFiveFeetToInches;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    IBW_JDRobinsonFormula = (): number | number[] => {
        const cm = this.height * 100;

        const feet = cm / this.FEET_RATIO;
        const overFiveFeet = feet - this.FIVE_FEET;
        const overFiveFeetToInches = overFiveFeet * this.INCH_RATIO;

        const male = 52 + 1.9 * overFiveFeetToInches;
        const female = 49 + 1.7 * overFiveFeetToInches;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    IBW_BJDevineFormula = (): number | number[] => {
        const cm = this.height * 100;

        const feet = cm / this.FEET_RATIO;
        const overFiveFeet = feet - this.FIVE_FEET;
        const overFiveFeetToInches = overFiveFeet * this.INCH_RATIO;

        const male = 50 + 2.3 * overFiveFeetToInches;
        const female = 45.5 + 2.3 * overFiveFeetToInches;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    IBW_HanwiFormula = (): number | Array<number> => {
        const cm = this.height * 100;

        const feet = cm / this.FEET_RATIO;
        const overFiveFeet = feet - this.FIVE_FEET;
        const overFiveFeetToInches = overFiveFeet * this.INCH_RATIO;

        const male = 48 + 2.7 * overFiveFeetToInches;
        const female = 45.5 + 2.2 * overFiveFeetToInches;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    IBW_Range = () => {
        const values = new Array<number>();
        const femaleValues = new Array<number>();
        const maleValues = new Array<number>();

        const hanwi = this.IBW_HanwiFormula();
        const miller = this.IBW_DRMillerFormula();
        const devine = this.IBW_BJDevineFormula();
        const robinson = this.IBW_JDRobinsonFormula();

        if (Array.isArray(hanwi)) {
            const [female, male] = hanwi;
            femaleValues.push(female);
            maleValues.push(male);
        }
        else values.push(hanwi);

        if (Array.isArray(miller)) {
            const [female, male] = miller;
            femaleValues.push(female);
            maleValues.push(male);
        }
        else values.push(miller);

        if (Array.isArray(devine)) {
            const [female, male] = devine;
            femaleValues.push(female);
            maleValues.push(male);
        }
        else values.push(devine);

        if (Array.isArray(robinson)) {
            const [female, male] = robinson;
            femaleValues.push(female);
            maleValues.push(male);
        }
        else values.push(robinson);

        if (values)
            return {
                minimun: Math.min(...values),
                maximun: Math.max(...values)
            }
        else {
            return {
                male: {
                    minimun: Math.min(...maleValues),
                    maximun: Math.max(...maleValues)
                },
                female: {
                    minimun: Math.min(...femaleValues),
                    maximun: Math.max(...femaleValues)
                }
            }
        }
    }

    mifflinStJeorFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;
        const age = new Date().getFullYear() - this.user.birthdate.getFullYear();

        const female = 10 * kg + 6.25 * cm - 5 * age - 161;
        const male = 10 * kg + 6.25 * cm - 5 * age + 5;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    harrisBenedictFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;
        const age = new Date().getFullYear() - this.user.birthdate.getFullYear();

        const female = 9.247 * kg + 3.098 * cm - 4.330 * age + 447.593;
        const male = 13.397 * kg + 4.799 * cm - 5.677 * age + 88.362;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    katchMcArdleFormula = (): number | number[] => {
        const fatPercentage = this.fatPercentage();
        if (Array.isArray(fatPercentage)) {
            const [female, male] = fatPercentage;

            const femaleFatPercentage = 370 + 21.6 * (1 - female) * this.weight;
            const maleFatPercentage = 370 + 21.6 * (1 - male) * this.weight;

            return [femaleFatPercentage, maleFatPercentage];
        }

        else return 370 + 21.6 * (1 - fatPercentage) * this.weight;
    }

    fatPercentage = (): number | number[] => {
        const age = new Date().getFullYear() - this.user.birthdate.getFullYear();
        const BMI = this.calculateBMI().value;

        const female = 1.20 * BMI + 0.23 * age - 5.4;
        const male = 1.20 * BMI + 0.23 * age - 16.2;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male];
    }

    //Basal metabolic rate
    //Taxa metabólica basal
    BMRCalculation = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;
        const age = new Date().getFullYear() - this.user.birthdate.getFullYear();

        const female = 655 + (9.6 * kg) + (1.8 * cm) - (4.7 * age);
        const male = 66 + (13.7 * kg) + (5 * cm) - (6.8 * age);

        if (this.user.sex === Sex.MALE) return male;
        if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male]
    }

    BMRCalculationBaseOnActivity = (): Object | Object[] => {
        const bmr = this.BMRCalculation();

        if (Array.isArray(bmr)) {
            const [femaleBMR, maleBMR] = bmr;

            const female = getBMRValues(femaleBMR);
            const male = getBMRValues(maleBMR);

            return [female, male];
        }

        else return getBMRValues(bmr);
    }

    //Lean Body Mass
    //Massa corporal magra
    LBM_BoerFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;

        const male = (0.407 * kg) + (0.267 * cm) - 19.2;
        const female = (0.252 * kg) + (0.473 * cm) - 48.3;

        if (this.user.sex === Sex.MALE) return male;
        if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male]
    }

    LBM_JamesFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;

        const male = (1.1 * kg) - (128 * ((kg * kg) / (cm * cm)));
        const female = (1.07 * kg) - (148 * ((kg * kg) / (cm * cm)));

        if (this.user.sex === Sex.MALE) return male;
        if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male]

    }

    LBM_HumeFormula = (): number | number[] => {
        const kg = this.weight;
        const cm = this.height * 100;

        const male = (0.32810 * kg) + (0.33929 * cm) - 29.5336;
        const female = (0.29569 * kg) + (0.41813 * cm) - 43.2933;

        if (this.user.sex === Sex.MALE) return male;
        else if (this.user.sex === Sex.FEMALE) return female;
        else return [female, male]
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
        const { user, weight, height } = this;

        const client = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthdate: new Date(user.birthdate),
            height,
            weight,
            role: user.role,
            sex: user.sex,
            image: user.image,
        }

        return client;
    }
}