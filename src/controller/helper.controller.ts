import Helper, { IHelper } from "@/entity/helper.entity";
import User, { IUser } from "@/entity/user.entity";
import HelperService from "@/service/helper.service";
import UserService from "@/service/user.service";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class HelperController {
    createHelper = LogAsyncError(async (request: Request, response: Response) => {
            const { email, certifications, clients, occupation } = request.body.user;
            let user: User = await UserService.getUserByEmail(email);
            let helper = await HelperService.createHelper(user, certifications, clients, occupation);

            return response
                .status(httpStatus.CREATED)
                .json({ user: helper.user.toJSON() });
    });

    addClient = LogAsyncError(async (request: Request, response: Response) => {

    });

    removeClient = LogAsyncError(async (request: Request, response: Response) => {
  
    });

    addCertification = LogAsyncError(async (request: Request, response: Response) => {
    
    });

    removeCertification = LogAsyncError(async (request: Request, response: Response) => {
    });


}

export default new HelperController();