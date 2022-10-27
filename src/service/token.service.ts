import enviroment from "@/configuration/enviroment";
import { TokenType } from "@/types/token.type";
import Token, { IToken } from "@/entity/token.entity";
import ApiError from "@/utils/apiError";
import { t } from "i18next";
import { IsNull } from "typeorm";
import { sign, verify } from "jsonwebtoken";
import Database from "@/configuration/database";
import Logger from "@/configuration/logger";
import httpStatus from "http-status";
import Helper from "@/entity/helper.entity";
import Client from "@/entity/client.entity";
import ClientService from "./client.service";
import HelperService from "./helper.service";


const TokenService = Database.getRepository(Token).extend({
    MINUTE: 60 * 1000, //In milliseconds
    DAY: 24 * 60 * 60 * 1000, //In milliseconds

    verifyToken: function (jwt: string): boolean {
        try {
            if (!jwt) return false;

            if (jwt.startsWith("Bearer ")) jwt = jwt.split(" ")[1];

            let validToken = false;

            verify(jwt, enviroment.jwt.secret, function (error: any) {
                if (error) validToken = false;
                else validToken = true;
            });

            return validToken;
        } catch (error) {
            Logger.error("Invalid token: " + error);
            return false;
        }
    },

    invalidToken: function (token?: Token) {
        return (!token) ||
            token.deletedAt !== null ||
            token.isExpired() ||
            !this.verifyToken(token.jwt)
    },

    generateTokens: function (userId: string, expires: Date, tokenType: TokenType): string {
        try {
            const payload = {
                sub: userId,
                iat: new Date().getTime(),
                exp: expires.getTime(),
                type: tokenType
            };

            return sign(payload, enviroment.jwt.secret);
        } catch (error) {
            throw error;
        }
    },

    saveToken: async function (data: IToken): Promise<Client | Helper> {
        try {
            const token: Token = new Token(data.jwt, data.type, data.expires, data.client, data.helper);
            const user = data.client || data.helper;

            user?.addToken(token);

            const isClient = user instanceof Client;
            if (isClient) return await ClientService.save(user!);
            else return await HelperService.save(user!);

        } catch (error: any) {
            console.log({ error });
            throw error;
        }
    },

    getTokenByJWT: async function (jwt: string, tokenType: TokenType): Promise<Token> {
        try {
            let token = await this.findOne({ where: { jwt, type: tokenType, deletedAt: IsNull() }, relations: ["helper", "client"] })
            if (this.invalidToken(token)) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.TOKEN.NOT_FOUND")));
            return token!;
        } catch (error: any) {
            throw error;
        }
    },

    getTokenByID: async function (id: string, tokenType: TokenType): Promise<Token> {
        try {
            const token = await this.find({
                where: { id, type: tokenType, deletedAt: IsNull() },
            });

            if (this.invalidToken(token)) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.TOKEN.NOT_FOUND")));

            return token!;
        } catch (error: any) {
            throw error;
        }
    },

    deleteToken: async function (token: Token): Promise<void> {
        try {
            token.invalidate();
            await this.save(token);
        } catch (error: any) {
            throw error;
        }
    },

    generateAuthenticationTokens: async function (user: Helper | Client): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const userAccessToken = user.tokens.find((token: Token) => token.type === "ACCESS_TOKEN");
            const userRefreshToken = user.tokens.find((token: Token) => token.type === "REFRESH_TOKEN");

            const refreshTokenExpires = Token.setExpirationTime(enviroment.jwt.refresh * this.DAY);
            const refreshToken = !this.invalidToken(userRefreshToken) ? userRefreshToken : this.generateTokens(user.id, refreshTokenExpires, "REFRESH_TOKEN");

            const accessTokenExpires = Token.setExpirationTime(enviroment.jwt.access * this.MINUTE);
            const accessToken = !this.invalidToken(userAccessToken) ? userAccessToken : this.generateTokens(user.id, accessTokenExpires, "ACCESS_TOKEN");

            const isClient = user instanceof Client;
            await this.saveToken({ jwt: refreshToken, expires: refreshTokenExpires, client: isClient ? user : undefined, helper: isClient ? undefined : user, type: "REFRESH_TOKEN" } as IToken);

            return { accessToken, refreshToken }
        } catch (error: any) {
            throw error;
        }
    },

    generateVerifyEmailToken: async function (user: Client | Helper) {
        try {
            const expires = new Date(new Date().getTime() + (enviroment.jwt.verify_email * this.MINUTE));
            const verifyEmailToken = this.generateTokens(user.id, expires, "VERIFY_EMAIL");

            const isClient = user instanceof Client;
            return await this.saveToken({ jwt: verifyEmailToken, expires, client: isClient ? user : undefined, helper: isClient ? undefined : user, type: "VERIFY_EMAIL" });
        } catch (error: any) {
            throw error;
        }
    },


    generateResetPasswordToken: async function (user: Client | Helper): Promise<Token> {
        try {
            const expires = new Date(new Date().getTime() + (enviroment.jwt.reset_password * this.MINUTE));
            const resetPasswordToken = this.generateTokens(user.id, expires, "RESET_PASSWORD");

            const isClient = user instanceof Client;
            return this.saveToken({ jwt: resetPasswordToken, expires, client: isClient ? user : undefined, helper: isClient ? undefined : user, type: "RESET_PASSWORD" });
        } catch (error: any) {
            throw error;
        }
    }
});

export default TokenService;