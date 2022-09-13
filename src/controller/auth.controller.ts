import User from "@/entity/user.entity";
import Token from "@/entity/token.entity";
import UserService from "@service/user.service";
import { getPassword, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";
import AuthenticationService from "@/service/auth.service";
import TokenService from "@/service/token.service";
import EmailService from "@/service/email.service";

class AuthenticationController {
    login = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const authorization: string = request.headers!.authorization!;

            let user: User;

            try {
                user = await AuthenticationService.login(authorization);
            } catch (error: any) {
                return response
                    .status(httpStatus.BAD_REQUEST)
                    .json(error.message);
            }

            const tokens = await TokenService.generateAuthenticationTokens(user);

            return response.status(httpStatus.CREATED).json({ user: user.toJSON(), tokens, message: t("SUCCESS.LOGIN") });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });

    logout = LogAsyncError(async (request: Request, response: Response) => {
        try {
            await AuthenticationService.logout(request.headers!.authorization!);
            return response.status(httpStatus.OK).json({ message: t("SUCCESS.LOGOUT") });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });

    refreshToken = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const authorization = request.headers!.authorization!
            const tokens = await AuthenticationService.refreshToken(authorization);
            return response.status(httpStatus.CREATED).json({ tokens });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });

    sendforgotPasswordEmail = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const email: string = request.body.email;

            const user: User = await UserService.getUserByEmail(email);

            const jwt: Token = await TokenService.generateResetPasswordToken(user);

            EmailService.sendForgotPasswordEmail(user.name, user.email, jwt.jwt);
            return response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });

    resetPassword = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const jwt: string = request.body.jwt;

            const authorization: string = request.headers!.authorization!;
            const password: string = getPassword(authorization);

            if (!validPassword(password)) return response.status(httpStatus.BAD_REQUEST).json({ message: t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.PASSWORD") }) })

            await AuthenticationService.resetPassword(jwt, password);
            response.status(httpStatus.CREATED).json({ message: t("SUCCESS.OK") });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });

    sendVerificationEmail = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const email: string = request.body.email;

            const user: User = await UserService.getUserByEmail(email);
            const jwt: Token = await TokenService.generateVerifyEmailToken(user);
            EmailService.sendVerificationEmail(user.name, user.email, jwt.jwt);
            return response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });

    verifyEmail = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const token: string = request.body.token;
            await AuthenticationService.verifyEmail(token);
            response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") });
        } catch (error) {
            return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t("ERROR.HTTP.SERVER_ERROR") });
        }
    });
}


export default new AuthenticationController();