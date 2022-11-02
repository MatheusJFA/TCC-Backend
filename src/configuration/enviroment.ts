import { EnviromentValues } from "@/types/enviroment.type";
import dotenv from "dotenv";
import * as Yup from "yup";

dotenv.config();

const enviromentSchema = Yup.object()
  .shape({
    NODE_ENVIROMENT: Yup.string().required(),
    PORT: Yup.number().required(),

    FRONTEND_URL: Yup.string().required(),
    BACKEND_URL: Yup.string().required(),

    DB_HOST: Yup.string().required(),
    DB_PORT: Yup.number().required(),
    DB_USER: Yup.string().required(),
    DB_PASSWORD: Yup.string().required(),
    DB_DATABASE: Yup.string().required(),

    REDIS_HOST: Yup.string().required(),
    REDIS_PORT: Yup.string().required(),
    REDIS_USER: Yup.string().required(),
    REDIS_PASSWORD: Yup.string().required(),

    JWT_SECRET: Yup.string().required(),
    JWT_ACCESS_EXPIRATION_TIME: Yup.number().required().default(30),
    JWT_REFRESH_EXPIRATION_TIME: Yup.number().required().default(30),
    JWT_RESET_PASSWORD_EXPIRATION_TIME: Yup.number().required().default(10),
    JWT_VERIFY_EMAIL_EXPIRATION_TIME: Yup.number().required().default(10),

    SMTP_HOST: Yup.string(),
    SMTP_EMAIL: Yup.string(),
    SMTP_PASSWORD: Yup.string(),
    SMTP_SECRET: Yup.string(),
    SMTP_FROM: Yup.string(),

    RAPID_API_KEY: Yup.string(),
  })
  .unknown();

const enviroment = enviromentSchema.validateSync(process.env);

export default {
  node_enviroment: enviroment.NODE_ENVIROMENT,
  port: enviroment.PORT,

  url: {
    frontend: enviroment.FRONTEND_URL,
    backend: enviroment.BACKEND_URL,
  },

  database: {
    hostname: enviroment.DB_HOST,
    port: enviroment.DB_PORT,
    username: enviroment.DB_USER,
    password: enviroment.DB_PASSWORD,
    name: enviroment.DB_DATABASE,
  },

  redis: {
    hostname: enviroment.REDIS_HOST,
    port: enviroment.REDIS_PORT,
    username: enviroment.REDIS_USER,
    password: enviroment.REDIS_PASSWORD,
  },

  jwt: {
    secret: enviroment.JWT_SECRET,
    access: enviroment.JWT_ACCESS_EXPIRATION_TIME,
    refresh: enviroment.JWT_REFRESH_EXPIRATION_TIME,
    reset_password: enviroment.JWT_RESET_PASSWORD_EXPIRATION_TIME,
    verify_email: enviroment.JWT_VERIFY_EMAIL_EXPIRATION_TIME,
  },

  smtp: {
    host: enviroment.SMTP_HOST,
    email: enviroment.SMTP_EMAIL,
    password: enviroment.SMTP_PASSWORD,
    secret: enviroment.SMTP_SECRET,
    from: enviroment.SMTP_FROM,
  },

  api: {
    rapidapi: {
      key: enviroment.RAPID_API_KEY,
    },
  },
};
