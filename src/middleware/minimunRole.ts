import TokenService from "@/service/token.service";
import { Role, minimunRoleRequired } from "@/types/role.type";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

export const minimunRole = (role: Role) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        const authorization = request.headers!.authorization!;

        if(!authorization) return response.status(httpStatus.UNAUTHORIZED).json({ message: t("ERROR.HTTP.UNAUTHORIZED") });

        const token = await TokenService.getTokenByJWT(authorization, "ACCESS_TOKEN");

        if (!minimunRoleRequired(token.user.role as Role, role)) 
            return response.status(httpStatus.UNAUTHORIZED).json({ message: t("ERROR.HTTP.UNAUTHORIZED") });
    
        next();
    }
}