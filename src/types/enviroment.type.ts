export const Enviroment = {
    TEST: "TEST", 
    DEVELOPMENT: "DEVELOPMENT",
    PRODUCTION: "PRODUCTION"
}

type Enviroment = keyof typeof Enviroment;

export const EnviromentValues = Object.values(Enviroment);
