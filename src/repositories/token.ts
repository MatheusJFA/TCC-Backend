import { t } from "i18next";
import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import { getConnection, getRepository } from "typeorm";

import User from "../entity/user";
import Role from "../entity/role";
import Token from "../entity/token";

import { TokenType } from "../enums/token";
import UserRepository from "./user";

const generateToken = (userID: string, roleID: number, expires: Moment, type: TokenType) => {
  const payload = {
    sub: userID,
    role: roleID,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
}

const saveToken = async (jwtToken: string, userID: string, expires: Moment, type: TokenType, blacklisted: boolean = false) => {
  try {
    const repository = getConnection("default").getRepository(Token);
    const user = await UserRepository.getUser(userID);
    if (!user) throw new Error(t("MSG_E001"));
    const token = new Token(jwtToken, user, expires.toDate().toISOString(), type, blacklisted, new Date(), new Date());
    return await repository.insert(token);
  } catch (error) {
    throw error;
  }
}

const expiredToken = (expires: string | number) => {
  const expiresIn = moment(expires);
  return moment().isSameOrAfter(expiresIn);
}

const verifyToken = async (tokenID: string, type: TokenType) => {
  try {
    const token = await getTokenByID(tokenID, type);
    if (!token || expiredToken(token.expiresIn)) throw new Error(t("MSG_E005"));
    return token;
  } catch (error) {
    throw error;
  }
}

const getToken = async (token: string, type: TokenType, user: User, blacklisted: boolean = false) => {
  try {
    const repository = getConnection("default").getRepository(Token);
    const tokenData = await repository.findOne({ token, type, user, blacklisted });
    if (!tokenData) throw new Error(t("MSG_E005"));
    return tokenData;
  } catch (error) {
    throw error;
  }
}

const getTokenByID = async (id: string, type: TokenType) => {
  try {
    const repository = getConnection("default").getRepository(Token);
    const token = await repository.findOne({ id, type }, { relations: ["user"] });
    if (!token) throw new Error(t("MSG_E005"));
    return token;
  } catch (error) {
    throw error;
  }
}

const deleteToken = async (token: Token) => {
  try {
    const repository = getConnection("default").getRepository(Token);
    await repository.update(token.id, { blacklisted: true });
  } catch (error) {
    throw error;
  }
}

const generateAuthTokens = async (user: User) => {
  try {
    const accessTokenExpires = moment().add(process.env.ACCESS_TOKEN_EXPIRES_IN, "minutes");
    const accessToken = generateToken(user.id, user.role, accessTokenExpires, TokenType.ACCESS_TOKEN);

    const refreshTokenExpires = moment().add(process.env.REFRESH_TOKEN_EXPIRES_IN, "days");
    const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, TokenType.REFRESH_TOKEN);

    await saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH_TOKEN);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires
      }
    }
  } catch (error) {
    throw error;
  }
}

const generateResetPasswordToken = async (email: string) => {
  try {
    const user = await UserRepository.userExists(email);

    if (!user) throw new Error(t("MSG_E001"));

    const expiresIn = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, "minutes");
    const resetPasswordToken = generateToken(user.id, Role.User.ToInt(), expiresIn, TokenType.RESET_PASSWORD);
    const token = await saveToken(resetPasswordToken, user.id, expiresIn, TokenType.RESET_PASSWORD);

    return token.identifiers[0].id;
  } catch (error) {
    throw error;
  }
}


const generateVerifyEmailToken = async (user: User) => {
  try {
    const expiresIn = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, "minutes");
    const verifyEmailToken = generateToken(user.id, Role.User.ToInt(), expiresIn, TokenType.VERIFY_EMAIL);
    const token = await saveToken(verifyEmailToken, user.id, expiresIn, TokenType.VERIFY_EMAIL);

    return token.identifiers[0].id;
  } catch (error) {
    throw error;
  }
}

export default {
  generateToken,
  saveToken,
  expiredToken,
  verifyToken,
  getToken,
  getTokenByID,
  deleteToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};