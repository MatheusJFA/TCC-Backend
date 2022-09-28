import enviroment from "@/configuration/enviroment";
import { TokenType } from "@/types/token.type";
import Token, { IToken } from "@/entity/token.entity";
import { t } from "i18next";
import Client from "@/entity/client.entity";
import { IsNull } from "typeorm";
import { sign, verify } from "jsonwebtoken";
import Database from "@/configuration/database";
import Logger from "@/configuration/logger";
import Helper from "@/entity/helper.entity";
import UserService from "./user.service";
import User from "@/entity/user.entity";

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

    saveToken: async function (data: IToken): Promise<User> {
        try {
            const token: Token = new Token(data.jwt, data.type, data.expires, data.user);
            const user = data.user

            user?.addToken(token);

            return UserService.save(user);
        } catch (error: any) {
            throw error;
        }
    },

    getTokenByJWT: async function (jwt: string, tokenType: TokenType): Promise<Token> {
        try {

            let token = await this.findOne({ where: { jwt, type: tokenType, deletedAt: IsNull() }, relations: ["user"] });

            if (this.invalidToken(token)) throw new Error(t("ERROR.TOKEN.NOT_FOUND"));

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

            if (this.invalidToken(token)) throw new Error(t("ERROR.TOKEN.NOT_FOUND"));

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

    generateAuthenticationTokens: async function (user: User): Promise<{ accessToken: string, refreshToken: string }> {
        try {

            const userAccessToken = user.tokens.find((token: Token) => token.type === "ACCESS_TOKEN");
            const userRefreshToken = user.tokens.find((token: Token) => token.type === "REFRESH_TOKEN");

            const refreshTokenExpires = Token.setExpirationTime(enviroment.jwt.refresh * this.DAY);
            const refreshToken = !this.invalidToken(userRefreshToken) ? userRefreshToken : this.generateTokens(user.id, refreshTokenExpires, "REFRESH_TOKEN");

            const accessTokenExpires = Token.setExpirationTime(enviroment.jwt.access * this.MINUTE);
            const accessToken = !this.invalidToken(userAccessToken) ? userAccessToken : this.generateTokens(user.id, accessTokenExpires, "ACCESS_TOKEN");

            await this.saveToken({ jwt: refreshToken, expires: refreshTokenExpires, user, type: "REFRESH_TOKEN" } as IToken);

            return { accessToken, refreshToken }
        } catch (error: any) {
            throw error;
        }
    },

    generateVerifyEmailToken: async function (user: User): Promise<Token> {
        try {
            const expires = new Date(new Date().getTime() + (enviroment.jwt.verify_email * this.MINUTE));
            const verifyEmailToken = this.generateTokens(user.id, expires, "VERIFY_EMAIL");
            return this.saveToken({ jwt: verifyEmailToken, expires, user, type: "VERIFY_EMAIL" });
        } catch (error: any) {
            throw error;
        }
    },


    generateResetPasswordToken: async function (user: User): Promise<Token> {
        try {
            const expires = new Date(new Date().getTime() + (enviroment.jwt.reset_password * this.MINUTE));
            const resetPasswordToken = this.generateTokens(user.id, expires, "RESET_PASSWORD");
            return this.saveToken({ jwt: resetPasswordToken, expires, user, type: "RESET_PASSWORD" });
        } catch (error: any) {
            throw error;
        }
    }
});

export default TokenService;