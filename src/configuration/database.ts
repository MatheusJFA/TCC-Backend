import { Enviroment } from "@/types/enviroment.type";
import { DataSource, DataSourceOptions } from "typeorm";
import enviroment from "./enviroment";

const connectionOption: DataSourceOptions = {
    type: "postgres",
    host: enviroment.database.hostname,
    port: enviroment.database.port,
    username: enviroment.database.username,
    password: enviroment.database.password,
    database: enviroment.database.name,
    synchronize: enviroment.node_enviroment === Enviroment.DEVELOPMENT,
    logging: false,
    entities: [`${__dirname}/../entity/**/*.entity{.js,.ts}`],
    migrations: [`${__dirname}/../infrastructure/migration/**/*.{js,.ts}`],
};


export default new DataSource(connectionOption);