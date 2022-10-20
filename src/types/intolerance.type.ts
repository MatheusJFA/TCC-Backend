export const Intolerances = {
    NONE: "",
    DAIRY: "dairy",
    EGG: "egg",
    GLUTEN: "gluten",
    PEANUT: "peanut",
    SESAME: "sesame",
    SEAFOOD: "seafood",
    SHELLFISH: "shellfish",
    SOY: "soy",
    SULFITE: "sulfite",
    TREE_NUT: "tree nut",
    WHEAT: "wheat",
    GRAINS: "grains",
    CORN: "corn",
};

export type Intolerances = keyof typeof Intolerances;

export const ValidIntolerances = (intolerances: string) => Object.values(Intolerances).find(value => value === intolerances) || null;

export const IntolerancesValues = Object.values(Intolerances);