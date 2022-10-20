export const Diet = {
    NO_DIET: "No Diet",
    PESCETARIAN: "pescetarian",
    LACTO_VEGETARIAN: "lacto vegetarian",
    OVO_VEGETARIAN: "ovo vegetarian",
    VEGAN: "vegan",
    PALEO: "paleo",
    PRIMAL: "primal",
    VEGETARIAN: "vegetarian",
    KETOGENIC: "ketogenic",
    WHOLE_30: "whole 30"
}

export type DietType = keyof typeof Diet;

export const ValidDiet = (diet: string) => Object.values(Diet).find(value => value === diet) || null;

export const DietValues = Object.values(Diet);


