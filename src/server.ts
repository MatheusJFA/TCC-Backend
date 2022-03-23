import 'reflect-metadata';
import express from 'express';

import dotenv from "dotenv";
dotenv.config();

import helmet from 'helmet';
import path from 'path';

import morgan from "./configuration/morgan";
import cors from 'cors';

import i18next from 'i18next';
import i18next_backend from 'i18next-fs-backend';
import i18next_middleware from 'i18next-http-middleware';

import passport from 'passport';
import jwtStrategy from "./configuration/passport";

import routes from './routes';
import Database from './infrastructure/connection';
import changeLocale from './middleware/changeLocale';

const application = express();

i18next.use(i18next_backend).use(i18next_middleware.LanguageDetector).init({
  fallbackLng: 'en',
  preload: ['pt', 'en'],
  backend: {
    loadPath: './src/locales/{{lng}}.json',
  }
});

application.use(i18next_middleware.handle(i18next));
application.use(changeLocale);

(async () => {
  console.log('🌎 Connecting to database...');
  await Database.getConnection('default');
})();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: true,
  optionsSuccessStatus: 204,
  credentials: true
};

application.use(cors(corsOptions));
application.use(passport.initialize());
passport.use('jwt', jwtStrategy);

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(helmet());

application.use(morgan);
application.use(routes);

application.use("/files", express.static(path.join(__dirname, "..", "uploads")));

application.listen(process.env.PORT, () => {
  console.log(`🚀 - Server is running at ${process.env.BACKEND_URL}`);
});

export default application;