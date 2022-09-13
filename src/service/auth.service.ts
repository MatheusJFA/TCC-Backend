import Database from "@/configuration/database";
import Token from "@/entity/token.entity";
import User from "@/entity/user.entity";
import { getEmailAndPassword } from "@/utils/autenticator";
import { t } from "i18next";
import TokenService from "./token.service";
import UserService from "./user.service";

const AuthenticationService = {
    login: async function (authorization: string): Promise<User> {
        try {
            const [email, password] = getEmailAndPassword(authorization);

            const user = await UserService.getUserByEmail(email);

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
            if(jwt.startsWith("Bearer ")) jwt = jwt.split(" ")[1];
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
            const user = await UserService.getUserByID(refreshToken.user.id);

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
            if (!jwt) throw new Error(t("ERROR.TOKEN.NOT_FOUND"));

            const user: User = jwt.user;

            user.hashPassword(password);
            await UserService.save(user);

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
            await UserService.save(user);

            jwt.invalidate();
            await TokenService.deleteToken(jwt);
        } catch (error) {
            throw error;
        }
    },
};

export default AuthenticationService;