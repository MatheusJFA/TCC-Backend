export const CarbsIntake = {
    LOW_INTAKE: "Low Carb",
    MODERATE_INTAKE: "Moderate Carbs",
    HIGH_INTAKE: "High Carbs"
}

export type CarbsIntake = keyof typeof CarbsIntake;

export const ValidCarbsIntake = (carbsIntake: string) => Object.values(CarbsIntake).find(value => value === carbsIntake) || null;

export const CarbsIntakeValues = Object.values(CarbsIntake);
