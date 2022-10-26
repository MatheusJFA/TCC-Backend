import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { t } from "i18next";
import { verify } from "jsonwebtoken";

export const privateRoute = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const authorization = request.headers!.authorization!;

    const payload = verify(authorization, "ACCESS_TOKEN");
    const userId = payload.sub!;

    if (id !== userId) 
        return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.UNAUTHORIZED") });

    next();
}