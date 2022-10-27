import Token from "@/entity/token.entity";
import { getPassword, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";
import AuthenticationService from "@/service/auth.service";
import TokenService from "@/service/token.service";
import EmailService from "@/service/email.service";
import ClientService from "@/service/client.service";
import HelperService from "@/service/helper.service";

class AuthenticationController {
    login = LogAsyncError(async (request: Request, response: Response) => {
        const authorization: string = request.headers!.authorization!;

        let user = await AuthenticationService.login(authorization);

        if (!user) return response.status(httpStatus.BAD_REQUEST).json({ message: t("ERROR.USER.NOT_FOUND") })

        if (!user.isEmailVerified) return response.status(httpStatus.BAD_REQUEST).json({ message: t("ERROR.USER.NOT_VERIFIED") })

        const tokens = await TokenService.generateAuthenticationTokens(user);
        return response.status(httpStatus.CREATED).json({ user: user.toJSON(), tokens, message: t("SUCCESS.LOGIN") });
    });

    logout = LogAsyncError(async (request: Request, response: Response) => {
        await AuthenticationService.logout(request.headers!.authorization!);
        return response.status(httpStatus.OK).json({ message: t("SUCCESS.LOGOUT") });
    });

    refreshToken = LogAsyncError(async (request: Request, response: Response) => {
        const authorization = request.headers!.authorization!
        const tokens = await AuthenticationService.refreshToken(authorization);
        return response.status(httpStatus.CREATED).json({ tokens });
    });

    sendforgotPasswordEmail = LogAsyncError(async (request: Request, response: Response) => {
        const { email } = request.body;

        const user = await AuthenticationService.getClientOrHelperByEmail(email);

        const jwt: Token = await TokenService.generateResetPasswordToken(user);

        EmailService.sendForgotPasswordEmail(user.name, user.email, jwt.jwt);
        return response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") });
    });

    resetPassword = LogAsyncError(async (request: Request, response: Response) => {
        const jwt: string = request.body.jwt;

        const authorization: string = request.headers!.authorization!;
        const password: string = getPassword(authorization);

        if (!validPassword(password)) return response.status(httpStatus.BAD_REQUEST).json({ message: t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.PASSWORD") }) })

        await AuthenticationService.resetPassword(jwt, password);
        response.status(httpStatus.CREATED).json({ message: t("SUCCESS.OK") });
    });

    sendVerificationEmail = LogAsyncError(async (request: Request, response: Response) => {
        const { email } = request.body;

        const user = await AuthenticationService.getClientOrHelperByEmail(email);

        const jwt: Token = await TokenService.generateVerifyEmailToken(user);

        EmailService.sendVerificationEmail(user.name, user.email, jwt.jwt);
        return response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") });
    });

    sendContact = LogAsyncError(async (request: Request, response: Response) => {
        const { name, email, message } = request.body;

        EmailService.sendContactEmail(name, email, message);
        return response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") })
    });

    verifyEmail = LogAsyncError(async (request: Request, response: Response) => {
        const token: string = request.body.token;
        await AuthenticationService.verifyEmail(token);
        response.status(httpStatus.NO_CONTENT).json({ message: t("SUCCESS.OK") });
    });
}


export default new AuthenticationController();