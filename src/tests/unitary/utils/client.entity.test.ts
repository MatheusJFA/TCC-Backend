import database from "@/configuration/database";
import Client from "@/entity/client.entity";
import User from "@/entity/user.entity";
import ClientService from "@/service/client.service";
import UserService from "@/service/user.service";
import { clearAllDatabase } from "@/tests/fixtures/clearDatabase";

const maleUser = new User("maleUser", "maleUser@gmail.com", "MaleUser12345@", new Date("1995-04-04"), "MALE", "USER");
const femaleUser = new User("femaleUser", "femaleUser@gmail.com", "FemaleUser12345@", new Date("1998-12-18"), "FEMALE", "USER");
const otherUser = new User("otherUser", "otherUser@gmail.com", "OtherUser12345@", new Date("2000-01-01"), "OTHER", "USER");


let male: Client;
let female: Client;
let other: Client;

beforeAll(async () => {
    if (!database.isInitialized)
        await database.initialize()
            .then(async () => {
                console.log("🌎 Database initialized");
                try {
                    await UserService.createUser(maleUser);
                    male = await ClientService.createClient(maleUser, 1.89, 105, []);

                    await UserService.createUser(femaleUser);
                    female = await ClientService.createClient(femaleUser, 1.60, 50, []);

                    await UserService.createUser(otherUser);
                    other = await ClientService.createClient(otherUser, 1.82, 61, []);

                    console.log("👶 Clients created");
                } catch (error) {
                    console.log("❌ Couldn't create users", error);
                }
            })
            .catch((error) => {
                console.log(`❌ Database initialization failed: ${error}`);
            })

});

afterAll(async () => {
    await clearAllDatabase()
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));
});

describe("Test all the functionalities on client entity", () => {
    test("Test BMI Equation", async () => {
    expect(male.calculateBMI()).toStrictEqual({ value: 29.394473838918284, text: "OVERWEIGHT" });
        expect(female.calculateBMI()).toStrictEqual({ value: 19.531249999999996, text: "NORMAL" });
        expect(other.calculateBMI()).toStrictEqual({ value: 18.41565028378215, text: "MILD THINNESS" });
    });

    test("test IBW D.R.Miller Formula ", async () => {
        expect(male.IBW_DRMillerFormula()).toStrictEqual(76.51732283464567);
        expect(female.IBW_DRMillerFormula()).toStrictEqual(57.16929133858268);
        expect(other.IBW_DRMillerFormula()).toStrictEqual([68.9488188976378, 72.63149606299214]);
    });


    test("test IBW J.D.Robinson Formula ", async () => {
        expect(male.IBW_JDRobinsonFormula()).toStrictEqual(79.37795275590551);
        expect(female.IBW_JDRobinsonFormula()).toStrictEqual(54.08661417322835);
        expect(other.IBW_JDRobinsonFormula()).toStrictEqual([68.81102362204726, 74.14173228346458]);
    });


    test("test IBW B.J.Devine Formula ", async () => {
        expect(male.IBW_BJDevineFormula()).toStrictEqual(83.14173228346456);
        expect(female.IBW_BJDevineFormula()).toStrictEqual(52.38188976377953);
        expect(other.IBW_BJDevineFormula()).toStrictEqual([72.30314960629923, 76.80314960629923]);
    });


    test("test IBW Hanwi Formula ", async () => {
        expect(male.IBW_HanwiFormula()).toStrictEqual(86.90551181102362);
        expect(female.IBW_HanwiFormula()).toStrictEqual(52.08267716535433);
        expect(other.IBW_HanwiFormula()).toStrictEqual([71.13779527559056, 79.46456692913387]);
    });

    test("test IBW Range Formula ", async () => {
        expect(male.IBW_Range()).toStrictEqual({ "maximun": 86.90551181102362, "minimun": 76.51732283464567 })
        expect(female.IBW_Range()).toStrictEqual({ "maximun": 57.16929133858268, "minimun": 52.08267716535433 })
        expect(other.IBW_Range()).toStrictEqual({
            male: {
                "maximun": 79.46456692913387,
                "minimun": 72.63149606299214
            },
            female: {
                "maximun": 72.30314960629923,
                "minimun": 68.81102362204726
            }
        })
    });

    test("test BMR mifflin S.t. Jeor Formula ", async () => {
        expect(male.mifflinStJeorFormula()).toStrictEqual(2101.25);
        expect(female.mifflinStJeorFormula()).toStrictEqual(1219);
        expect(other.mifflinStJeorFormula()).toStrictEqual([1471.5, 1637.5]);
    });

    test("test BMR harris Benedict Formula ", async () => {
        expect(male.harrisBenedictFormula()).toStrictEqual(2248.779);
        expect(female.harrisBenedictFormula()).toStrictEqual(1301.703);
        expect(other.harrisBenedictFormula()).toStrictEqual([1475.9060000000002, 1648.4260000000004]);
    });

    test("test BMR katch McArdle Formula ", async () => {
        expect(male.katchMcArdleFormula()).toStrictEqual(2064.5732);
        expect(female.katchMcArdleFormula()).toStrictEqual(1195.5790000000002);
        expect(other.katchMcArdleFormula()).toStrictEqual([1397.8758302330639, 1540.1766302330636]);
    });

    test("test fat percentage ", async () => {
        expect(male.fatPercentage()).toStrictEqual(25.283368606701938);
        expect(female.fatPercentage()).toStrictEqual(23.557499999999997);
        expect(other.fatPercentage()).toStrictEqual([21.988780340538575, 11.188780340538578]);
    });

    test("test BMR calculation ", async () => {
        expect(male.BMRCalculation()).toStrictEqual(2265.9);
        expect(female.BMRCalculation()).toStrictEqual(1310.2);
        expect(other.BMRCalculation()).toStrictEqual([1460.1, 1655.2999999999997]);
    });

    test("test BMR Base on Activity calculation ", async () => {
        expect(male.BMRCalculationBaseOnActivity()).toStrictEqual({
            "base": 2265.9,
            "extremely_active": 4305,
            "moderately_active": 3116,
            "sedentary": 2719,
            "slightly_active": 3512,
            "very_active": 3909,
        });
        expect(female.BMRCalculationBaseOnActivity()).toStrictEqual({
            "base": 1310.2,
            "extremely_active": 2489,
            "moderately_active": 1802,
            "sedentary": 1572,
            "slightly_active": 2031,
            "very_active": 2260,
        });
        expect(other.BMRCalculationBaseOnActivity()).toStrictEqual([
            {
                "base": 1460.1,
                "extremely_active": 2774,
                "moderately_active": 2008,
                "sedentary": 1752,
                "slightly_active": 2263,
                "very_active": 2519,
            },
            {
                "base": 1655.2999999999997,
                "extremely_active": 3145,
                "moderately_active": 2276,
                "sedentary": 1986,
                "slightly_active": 2566,
                "very_active": 2855,
            },
        ]);
    });

    test("test BMR Calculation Base on Miller calculation ", async () => {
        expect(male.BMRCalculationBaseOnMillerFormula()).toStrictEqual({
            "base": 2101.25,
            "extremely_active": 3992,
            "moderately_active": 2889,
            "sedentary": 2522,
            "slightly_active": 3257,
            "very_active": 3625
        });
        expect(female.BMRCalculationBaseOnMillerFormula()).toStrictEqual({
            "base": 1219,
            "extremely_active": 2316,
            "moderately_active": 1676,
            "sedentary": 1463,
            "slightly_active": 1889,
            "very_active": 2103
        });
        expect(other.BMRCalculationBaseOnMillerFormula()).toStrictEqual([
            {
                "base": 1471.5,
                "extremely_active": 2796,
                "moderately_active": 2023,
                "sedentary": 1766,
                "slightly_active": 2281,
                "very_active": 2538,
            },
            {
                "base": 1637.5,
                "extremely_active": 3111,
                "moderately_active": 2252,
                "sedentary": 1965,
                "slightly_active": 2538,
                "very_active": 2825,
            },
        ]);
    });

    test("test Macronutrients normal carb calculation ", async () => {
        expect(male.MNC_NormalCarb()).toStrictEqual({
            diet: {
                "carbs_bulking": 228,
                "carbs_cutting": 141,
                "carbs_maintaince": 184,
                "fats_bulking": 102,
                "fats_cutting": 63,
                "fats_maintaince": 82,
                "proteins_bulking": 196,
                "proteins_cutting": 121,
                "proteins_maintaince": 158,
            }
        });
        expect(female.MNC_NormalCarb()).toStrictEqual({
            diet: {
                "carbs_bulking": 151,
                "carbs_cutting": 63,
                "carbs_maintaince": 107,
                "fats_bulking": 67,
                "fats_cutting": 28,
                "fats_maintaince": 48,
                "proteins_bulking": 129,
                "proteins_cutting": 54,
                "proteins_maintaince": 92,
            }
        });
        expect(other.MNC_NormalCarb()).toStrictEqual({
            female: {
                "carbs_bulking": 173,
                "carbs_cutting": 86,
                "carbs_maintaince": 129,
                "fats_bulking": 77,
                "fats_cutting": 38,
                "fats_maintaince": 58,
                "proteins_bulking": 148,
                "proteins_cutting": 73,
                "proteins_maintaince": 111
            },
            male: {
                "carbs_bulking": 188,
                "carbs_cutting": 100,
                "carbs_maintaince": 144,
                "fats_bulking": 84,
                "fats_cutting": 45,
                "fats_maintaince": 64,
                "proteins_bulking": 161,
                "proteins_cutting": 86,
                "proteins_maintaince": 123
            }
        });
    });


    test("test Macronutrients high carb calculation ", async () => {
        expect(male.MNC_HighCarb()).toStrictEqual({
            diet: {
                "carbs_bulking": 326,
                "carbs_cutting": 201,
                "carbs_maintaince": 263,
                "fats_bulking": 58,
                "fats_cutting": 36,
                "fats_maintaince": 47,
                "proteins_bulking": 196,
                "proteins_cutting": 121,
                "proteins_maintaince": 158,
            }
        });
        expect(female.MNC_HighCarb()).toStrictEqual({
            diet: {
                "carbs_bulking": 215,
                "carbs_cutting": 90,
                "carbs_maintaince": 153,
                "fats_bulking": 39,
                "fats_cutting": 16,
                "fats_maintaince": 28,
                "proteins_bulking": 129,
                "proteins_cutting": 54,
                "proteins_maintaince": 92,
            }
        });
        expect(other.MNC_HighCarb()).toStrictEqual({
            female: {
                "carbs_bulking": 247,
                "carbs_cutting": 122,
                "carbs_maintaince": 184,
                "fats_bulking": 44,
                "fats_cutting": 22,
                "fats_maintaince": 33,
                "proteins_bulking": 148,
                "proteins_cutting": 73,
                "proteins_maintaince": 111
            },
            male: {
                "carbs_bulking": 268,
                "carbs_cutting": 143,
                "carbs_maintaince": 205,
                "fats_bulking": 48,
                "fats_cutting": 26,
                "fats_maintaince": 37,
                "proteins_bulking": 161,
                "proteins_cutting": 86,
                "proteins_maintaince": 123
            }
        });
    });

    test("test Maximun muscular potential", async () => {
        expect(male.MMPCalculation()).toStrictEqual({
            "maximun": 91,
            "minimun": 87,
        })
        expect(female.MMPCalculation()).toStrictEqual({
            "maximun": 62,
            "minimun": 58,
        })
        expect(other.MMPCalculation()).toStrictEqual({
            "maximun": 84,
            "minimun": 80,
        })
    });

    test("test Macronutrients low carb calculation ", async () => {
        expect(male.MNC_LowCarb()).toStrictEqual({
            diet: {
                "carbs_bulking": 131,
                "carbs_cutting": 81,
                "carbs_maintaince": 106,
                "fats_bulking": 116,
                "fats_cutting": 72,
                "fats_maintaince": 94,
                "proteins_bulking": 261,
                "proteins_cutting": 161,
                "proteins_maintaince": 211,
            }
        });


        expect(male.MNC_LowCarb()).toStrictEqual({
            diet: {
                "carbs_bulking": 131,
                "carbs_cutting": 81,
                "carbs_maintaince": 106,
                "fats_bulking": 116,
                "fats_cutting": 72,
                "fats_maintaince": 94,
                "proteins_bulking": 261,
                "proteins_cutting": 161,
                "proteins_maintaince": 211,
            }
        });
        expect(other.MNC_LowCarb()).toStrictEqual({
            female: {
                "carbs_bulking": 99,
                "carbs_cutting": 49,
                "carbs_maintaince": 74,
                "fats_bulking": 88,
                "fats_cutting": 44,
                "fats_maintaince": 66,
                "proteins_bulking": 198,
                "proteins_cutting": 98,
                "proteins_maintaince": 148,
            },
            male: {
                "carbs_bulking": 107,
                "carbs_cutting": 57,
                "carbs_maintaince": 82,
                "fats_bulking": 95,
                "fats_cutting": 51,
                "fats_maintaince": 73,
                "proteins_bulking": 214,
                "proteins_cutting": 114,
                "proteins_maintaince": 164,
            }
        });
    });

    test("test Boer Lean Body mass calculation", () => {
        expect(male.LBM_BoerFormula()).toStrictEqual(73.998);
        expect(female.LBM_BoerFormula()).toStrictEqual(39.97999999999999);
        expect(other.LBM_BoerFormula()).toStrictEqual([53.158, 54.22099999999999]);
    });

    test("test James Lean Body mass calculation", () => {
        expect(male.LBM_JamesFormula()).toStrictEqual(75.99382716049385);
        expect(female.LBM_JamesFormula()).toStrictEqual(39.046875);
        expect(other.LBM_JamesFormula()).toStrictEqual([48.64435092380148, 52.7210602584229]);
    });

    test("test Hume Lean Body mass calculation", () => {
        expect(male.LBM_HumeFormula()).toStrictEqual(69.04271);
        expect(female.LBM_HumeFormula()).toStrictEqual(38.39200000000001);
        expect(other.LBM_HumeFormula()).toStrictEqual([50.843450000000004, 52.231280000000005]);
    });
});