import Logger from "@/configuration/logger";
import {Request, Response, NextFunction} from "express";
import { changeLanguage } from "i18next";

export const changeLocale = async (request: Request, response: Response, next: NextFunction) => {
    const language = request.headers["accept-language"] as string;

    await changeLanguage(language || "en").then(() => {
        next();
    }).catch((error) => {
        Logger.error(`Couldn't change language ${error}`);
        next(error)
    });
}