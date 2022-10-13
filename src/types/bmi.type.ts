import { t } from "i18next";

export const BMI = {
    SEVERE_THINNESS: "SEVERE THINNESS",
    MODERATE_THINNESS: "MODERATE THINNESS",
    MILD_THINNESS: "MILD THINNESS",
    NORMAL: "NORMAL",
    OVERWEIGHT: "OVERWEIGHT",
    OBESE_CLASS_I: "OBESE CLASS I",
    OBESE_CLASS_II: "OBESE CLASS II",
    OBESE_CLASS_III: "OBESE CLASS III"
}


export const getBMIName = (bmi: number): string => {
    if (bmi < 16) return t("BMI.MILD_THINNESS");
    else if (bmi > 16 && bmi < 18) return t("BMI.MODERATE_THINNESS");
    else if (bmi > 17 && bmi < 18.5) return t("BMI.MILD_THINNESS");
    else if (bmi > 18.5 && bmi < 25) return t("BMI.NORMAL");
    else if (bmi > 25 && bmi < 30) return t("BMI.OVERWEIGHT");
    else if (bmi > 30 && bmi < 35) return t("BMI.OBESE_CLASS_I");
    else if (bmi > 35 && bmi < 40) return t("BMI.OBESE_CLASS_II");
    else return t("BMI.OBESE_CLASS_III");
}