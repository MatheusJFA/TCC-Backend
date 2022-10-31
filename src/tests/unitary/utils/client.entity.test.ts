import database from "@/configuration/database";
import Client from "@/entity/client.entity";
import ClientService from "@/service/client.service";
import { clearAllDatabase } from "@/tests/fixtures/clearDatabase";

let male: Client;
let female: Client;

jest.setTimeout(60 * 1000);
jest.useFakeTimers()

beforeAll(async () => {
    if (!database.isInitialized)
        await database.initialize()
            .then(async () => {
                console.log("🌎 Database initialized");
                try {
                    male = await ClientService.createClient("maleUser", "maleUser@gmail.com", "MaleUser12345@", new Date("1995-04-04"), "MALE", "USER", 1.89, 105, [], "../assets/image/default-avatar.png");
                    female = await ClientService.createClient("femaleUser", "femaleUser@gmail.com", "FemaleUser12345@", new Date("1998-12-18"), "FEMALE", "USER", 1.60, 50, [], "../assets/image/default-avatar.png");

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
    });

    test("test IBW D.R.Miller Formula ", async () => {
        expect(male.IBW_DRMillerFormula()).toStrictEqual(76.51732283464567);
        expect(female.IBW_DRMillerFormula()).toStrictEqual(57.16929133858268);
    });


    test("test IBW J.D.Robinson Formula ", async () => {
        expect(male.IBW_JDRobinsonFormula()).toStrictEqual(79.37795275590551);
        expect(female.IBW_JDRobinsonFormula()).toStrictEqual(54.08661417322835);
    });


    test("test IBW B.J.Devine Formula ", async () => {
        expect(male.IBW_BJDevineFormula()).toStrictEqual(83.14173228346456);
        expect(female.IBW_BJDevineFormula()).toStrictEqual(52.38188976377953);
    });


    test("test IBW Hanwi Formula ", async () => {
        expect(male.IBW_HanwiFormula()).toStrictEqual(86.90551181102362);
        expect(female.IBW_HanwiFormula()).toStrictEqual(52.08267716535433);
    });

    test("test IBW Range Formula ", async () => {
        expect(male.IBW_Range()).toStrictEqual({ "maximun": 86.90551181102362, "minimun": 76.51732283464567 })
        expect(female.IBW_Range()).toStrictEqual({ "maximun": 57.16929133858268, "minimun": 52.08267716535433 })
    });

    test("test BMR mifflin S.t. Jeor Formula ", async () => {
        expect(male.mifflinStJeorFormula()).toStrictEqual(2101.25);
        expect(female.mifflinStJeorFormula()).toStrictEqual(1219);
    });

    test("test BMR harris Benedict Formula ", async () => {
        expect(male.harrisBenedictFormula()).toStrictEqual(2248.779);
        expect(female.harrisBenedictFormula()).toStrictEqual(1301.703);
    });

    test("test BMR katch McArdle Formula ", async () => {
        expect(male.katchMcArdleFormula()).toStrictEqual(2064.5732);
        expect(female.katchMcArdleFormula()).toStrictEqual(1195.5790000000002);
    });

    test("test Fat Percentage ", async () => {
        expect(male.fatPercentage()).toStrictEqual(25.283368606701938);
        expect(female.fatPercentage()).toStrictEqual(23.557499999999997);
    });

    test("test BMR calculation ", async () => {
        expect(male.BMRCalculation()).toStrictEqual(2265.9);
        expect(female.BMRCalculation()).toStrictEqual(1310.2);
    });

    test("test BMR Base on Activity calculation ", async () => {
        expect(male.BMRCalculationBaseOnActivity()).toStrictEqual({
            "base": 2265.9,
            "extremely_active": 4305,
            "moderately_active": 3512,
            "sedentary": 2719,
            "slightly_active": 3116,
            "very_active": 3909,
        });
        expect(female.BMRCalculationBaseOnActivity()).toStrictEqual({
            "base": 1310.2,
            "extremely_active": 2489,
            "moderately_active": 2031,
            "sedentary": 1572,
            "slightly_active": 1802,
            "very_active": 2260,
        });
    });

    test("test BMR Calculation Base on Miller calculation ", async () => {
        expect(male.BMRCalculationBaseOnMillerFormula()).toStrictEqual({
            "base": 2101.25,
            "extremely_active": 3992,
            "moderately_active": 3257,
            "sedentary": 2522,
            "slightly_active": 2889,
            "very_active": 3625
        });
        expect(female.BMRCalculationBaseOnMillerFormula()).toStrictEqual({
            "base": 1219,
            "extremely_active": 2316,
            "moderately_active": 1889,
            "sedentary": 1463,
            "slightly_active": 1676,
            "very_active": 2103
        });
    });

    test("test Macronutrients normal carb calculation ", async () => {
        expect(male.MNC_NormalCarb()).toStrictEqual({
            diet: {
                "carbs": 184,
                "fats": 82,
                "proteins": 158,
            }
        });
        expect(female.MNC_NormalCarb()).toStrictEqual({
            diet: {
                "carbs": 107,
                "fats": 48,
                "proteins": 92,
            }
        });
    });


    test("test Macronutrients high carb calculation ", async () => {
        expect(male.MNC_HighCarb()).toStrictEqual({
            diet: {
                "carbs": 263,
                "fats": 47,
                "proteins": 158,
            }
        });
        expect(female.MNC_HighCarb()).toStrictEqual({
            diet: {
                "carbs": 153,
                "fats": 28,
                "proteins": 92,
            }
        });
    });

    test("test Macronutrients low carb calculation ", async () => {
        expect(male.MNC_LowCarb()).toStrictEqual({
            diet: {
                "carbs": 106,
                "fats": 94,
                "proteins": 211,
            }
        });


        expect(male.MNC_LowCarb()).toStrictEqual({
            diet: {
                "carbs": 106,
                "fats": 94,
                "proteins": 211,
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
    });

    test("test Boer Lean Body mass calculation", () => {
        expect(male.LBM_BoerFormula()).toStrictEqual(73.998);
        expect(female.LBM_BoerFormula()).toStrictEqual(39.97999999999999);
    });

    test("test James Lean Body mass calculation", () => {
        expect(male.LBM_JamesFormula()).toStrictEqual(75.99382716049385);
        expect(female.LBM_JamesFormula()).toStrictEqual(39.046875);
    });

    test("test Hume Lean Body mass calculation", () => {
        expect(male.LBM_HumeFormula()).toStrictEqual(69.04271);
        expect(female.LBM_HumeFormula()).toStrictEqual(38.39200000000001);
    });
});