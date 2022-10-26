import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { t } from "i18next";
import { validate } from "uuid";

export const validID = async (request: Request, response: Response, next: NextFunction) => {
    const id  = request.params.id;

    if (!validate(id))
        return response.status(httpStatus.UNAUTHORIZED).json({ message: t("ERROR.HTTP.UNAUTHORIZED") });
    
    next();
}