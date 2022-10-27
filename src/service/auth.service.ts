import ApiError from "@/utils/apiError";
import Token from "@/entity/token.entity";
import { getEmailAndPassword } from "@/utils/autenticator";
import { t } from "i18next";
import TokenService from "./token.service";
import httpStatus from "http-status";
import HelperService from "./helper.service";
import ClientService from "./client.service";

import Client from "@/entity/client.entity";
import Helper from "@/entity/helper.entity";

const AuthenticationService = {
    login: async function (authorization: string): Promise<Client | Helper> {
        try {
            const [email, password] = getEmailAndPassword(authorization);

            let user = await this.getClientOrHelperByEmail(email);

            if (!user) throw new Error(t("ERROR.USER.INVALID_CREDENTIALS"))

            const isValidPassword = await user.comparePassword(password);

            if (!isValidPassword) throw new Error(t("ERROR.USER.INVALID_CREDENTIALS"));

            return user;
        } catch (error) {
            throw error;
        }
    },

    logout: async function (jwt: string): Promise<void> {
        try {
            if (jwt.startsWith("Bearer ")) jwt = jwt.split(" ")[1];
            const token = await TokenService.getTokenByJWT(jwt, "REFRESH_TOKEN");

            if (!token) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.TOKEN.NOT_FOUND")));

            token.invalidate();
            await TokenService.saveToken({ jwt: token.jwt, type: "REFRESH_TOKEN", client: token.client, helper: token.helper, expires: token.expires });
        } catch (error) {
            throw error;
        }
    },

    getClientOrHelperByEmail: async function (email: string): Promise<Client | Helper> {
        try {
            return await ClientService.returnClientByEmail(email) || HelperService.returnHelperByEmail(email);
        } catch (error) {
            throw error;
        }
    },

    getClientOrHelperByID: async function (id: string): Promise<Client | Helper> {
        try {
            return await ClientService.returnClientByID(id) || HelperService.returnHelperByID(id);
        } catch (error) {
            throw error;
        }
    },

    refreshToken: async function (token: string): Promise<{ accessToken: string; refreshToken: string; }> {
        try {
            const refreshToken = await TokenService.getTokenByJWT(token, "REFRESH_TOKEN");
            let id = refreshToken.client?.id || refreshToken.helper?.id;

            let user = this.getClientOrHelperByID(id)

            if (!user) throw new Error(t("ERROR.USER.NOT_FOUND"));

            refreshToken.invalidate();
            return await TokenService.generateAuthenticationTokens(user);
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async function (token: string, password: string): Promise<void> {
        try {
            const jwt: Token | undefined = await TokenService.getTokenByJWT(token, "RESET_PASSWORD");

            if (!jwt) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.TOKEN.NOT_FOUND")));

            const user = jwt.client || jwt.helper;

            user!.hashPassword(password);

            await user!.save();

            jwt.invalidate();
            await TokenService.deleteToken(jwt);
        } catch (error) {
            throw error;
        }
    },

    verifyEmail: async function (token: string): Promise<void> {
        try {
            const jwt: Token | undefined = await TokenService.getTokenByJWT(token, "VERIFY_EMAIL");

            if (!jwt) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.TOKEN.NOT_FOUND")));

            const user = jwt.client || jwt.helper;

            user!.verifyEmail();

            jwt.invalidate();
            await TokenService.deleteToken(jwt);
        } catch (error) {
            throw error;
        }
    },
};

export default AuthenticationService;