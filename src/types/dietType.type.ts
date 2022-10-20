export const DietType = {
    MAINTENANCE: "Maintenance",
    CUTTING: "Cutting",
    BULKING: "Bulking"
}

export type DietType = keyof typeof DietType;

export const ValidDietType = (dietType: string) => Object.values(DietType).find(value => value === dietType) || null;

export const DietTypeValues = Object.values(DietType);
