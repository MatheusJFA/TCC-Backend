export const Sex = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
};

export type Sex = keyof typeof Sex;

export const SexValues = Object.values(Sex);
