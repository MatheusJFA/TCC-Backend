import { t } from "i18next";

export const Activity {
    SEDENTARY = "SEDENTARY",
    SLIGHTLY_ACTIVE = "SLIGHTLY_ACTIVE",
    MODERATELY_ACTIVE = "MODERATELY_ACTIVE",
    VERY_ACTIVE = "VERY_ACTIVE",
    EXTREMELY_ACTIVE = "EXTREMELY_ACTIVE",
}

type Activity = keyof typeof Activity;

export const getActivityValue = (activity: Activity): number => {
    if (activity === Activity.SEDENTARY) return 1.2;
    else if (activity === Activity.SLIGHTLY_ACTIVE) return 1.375;
    else if (activity === Activity.MODERATELY_ACTIVE) return 1.55;
    else if (activity === Activity.VERY_ACTIVE) return 1.725;
    else return 1.9;
}

export const getBMRValues = (bmr: number): {
    sedentary: number,
    slightly_active: number,
    moderately_active: number,
    very_active: number,
    extremely_active: number,
} => {
    const sedentary = Math.round(bmr * 1.2);
    const slightly_active = Math.round(bmr * 1.55);
    const moderately_active = Math.round(bmr * 1.375);
    const very_active = Math.round(bmr * 1.725);
    const extremely_active = Math.round(bmr * 1.9);

    return {
        sedentary,
        slightly_active,
        moderately_active,
        very_active,
        extremely_active
    }
}