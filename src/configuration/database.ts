import { ConnectionOptions } from "typeorm";

const connectionOptions: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'base',
  synchronize: true,
  logging: true,
  migrations: [`${__dirname}/../infrastructure/migrations/**/*{.ts,.js}`],
  entities: [`${__dirname}/../entity/**/*{.ts,.js}`],
  cli: {
    "entitiesDir": __dirname + "../entity",
    "migrationsDir": __dirname + "../infrastructure/migrations",
  }
};

export default connectionOptions;