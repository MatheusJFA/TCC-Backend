import Helper from "@/entity/helper.entity";
import User, { IUser } from "@/entity/user.entity";
import UserService from "@/service/user.service";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class HelperController {
    createHelper = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const { email, certification, occupation } = request.body.user;
            let user: User;
            let helper: Helper;

            try {
                user = await UserService.getUserByEmail(email);
                // helper = await HelperService.
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }
            
            return response
                .status(httpStatus.CREATED)
                .json({ user: user.toJSON() });
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });
}

export default new HelperController();