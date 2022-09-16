import Database from "@/configuration/database";
import Token from "@/entity/token.entity";
import Client from "@/entity/client.entity";
import { getEmailAndPassword } from "@/utils/autenticator";
import { t } from "i18next";
import TokenService from "./token.service";
import ClientService from "./client.service";
import HelperService from "./helper.service";
import Helper from "@/entity/helper.entity";
import User from "@/entity/user.entity";

const AuthenticationService = {
    login: async function (authorization: string): Promise<Client> {
        try {
            const [email, password] = getEmailAndPassword(authorization);

            const user = await ClientService.getClientByEmail(email) || await HelperService.getHelperByEmail(email);

            if (!user) throw new Error(t("ERROR.USER.INVALID_CREDENTIALS"))

            const isValidPassword = user.comparePassword(password);

            if (!isValidPassword) throw new Error(t("ERROR.USER.INVALID_CREDENTIALS"))
            return user;
        } catch (error) {
            throw error;
        }
    },

    logout: async function (jwt: string): Promise<void> {
        try {
            if (jwt.startsWith("Bearer ")) jwt = jwt.split(" ")[1];
            const token = await TokenService.getTokenByJWT(jwt, "REFRESH_TOKEN");

            if (!token) throw new Error(t("ERROR.TOKEN.NOT_FOUND"));

            token.invalidate();
            await TokenService.saveToken({ jwt: token.jwt, type: "REFRESH_TOKEN", user: token.user, expires: token.expires });
        } catch (error) {
            throw error;
        }
    },

    refreshToken: async function (token: string): Promise<{ accessToken: string; refreshToken: string; }> {
        try {
            const refreshToken = await TokenService.getTokenByJWT(token, "REFRESH_TOKEN");
            const user = await ClientService.getClientByID(refreshToken.user.id) || await HelperService.getHelperByID(refreshToken.user.id);

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
            if (!jwt)
                throw new Error(t("ERROR.TOKEN.NOT_FOUND"));

            const user: User = jwt.user;

            user.hashPassword(password);

            if (user instanceof Client) ClientService.save(user);
            else if (user instanceof Helper) HelperService.save(user);
            else throw Error(t("ERROR.USER.INVALID_CREDENTIALS"))

            jwt.invalidate();
            await TokenService.deleteToken(jwt);
        } catch (error) {
            throw error;
        }
    },

    verifyEmail: async function (token: string): Promise<void> {
        try {
            const jwt: Token | undefined = await TokenService.getTokenByJWT(token, "VERIFY_EMAIL");
            if (!jwt) throw new Error(t("ERROR.TOKEN.NOT_FOUND"));

            const user: User = jwt.user;

            user.verifyEmail();

            const clientType = await ClientService.getClientByID(jwt.user.id);
            if (clientType) ClientService.save(user);

            const helperType = await HelperService.getHelperByID(jwt.user.id);
            if (helperType) HelperService.save(user)


            jwt.invalidate();
            await TokenService.deleteToken(jwt);
        } catch (error) {
            throw error;
        }
    },
};

export default AuthenticationService;