export const Occupation = {
    PERSONAL_TRAINNER: "PERSONAL_TRAINNER",
    PSYCHOLOGIST: "PSYCHOLOGIST",
    NUTRITIONIST: "NUTRITIONIST",
    OTHER: "OTHER"
}

export type Occupation = keyof typeof Occupation;

export const ValidOccupation = (occupation: string) => Object.values(Occupation).find(value => value === occupation) || null;

export const OccupationValues = Object.values(Occupation);
