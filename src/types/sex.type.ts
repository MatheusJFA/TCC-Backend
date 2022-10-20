export const Sex = {
    MALE: "MALE",
    FEMALE: "FEMALE",
};

export type Sex = keyof typeof Sex;

export const SexValues = Object.values(Sex);
