const Cuisine = {
    AFRICAN: "african",
    CHINESE: "chinese",
    JAPANESE: "japanese",
    KOREAN: "korean",
    VIETNAMESE: "vietnamese",
    THAI: "thai",
    INDIAN: "indian",
    BRITISH: "british",
    IRISH: "irish",
    FRENCH: "french",
    ITALIAN: "italian",
    MEXICAN: "mexican",
    SPANISH: "spanish",
    MIDDLE_EASTERN: "middle eastern",
    JEWISH: "jewish",
    AMERICAN: "american",
    CAJUN: "cajun",
    SOUTHERN: "southern",
    GREEK: "greek",
    GERMAN: "german",
    NORDIC: "nordic",
    EASTERN_EUROPEAN: "eastern european",
    CARIBBEAN: "caribbean",
    LATIN_AMERICAN: "latin american"
};


export type Cuisine = keyof typeof Cuisine;

export const ValidCuisine = (cuisine: string) => Object.values(Cuisine).find(value => value === cuisine) || null;

export const CuisineValues = Object.values(Cuisine);