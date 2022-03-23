import { t } from "i18next";
import bcrypt from "bcrypt";

import User from "../entity/user";
import { TokenType } from "../enums/token";
import tokenService from './token';
import UserRepository from './user';
import TokenRepository from "./token";

const login = async (email: string, password: string) => {
  try {
    const user = await UserRepository.userExists(email);
    if (!user) throw new Error(t("MSG_E002"));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error(t("MSG_E002"));
    return user;
  } catch (error) {
    throw error;
  }
}


const logout = async (refreshToken: string, user: User) => {
  try {
    const token = await TokenRepository.getToken(refreshToken, TokenType.REFRESH_TOKEN, user, false);

    if (!token)
      return t("MSG_E004");

    await TokenRepository.deleteToken(token);
  } catch (error) {
    throw error;
  }
}

const refreshAuthorization = async (refreshToken: string) => {
  try {
    const oldToken = await TokenRepository.verifyToken(refreshToken, TokenType.REFRESH_TOKEN);

    const token = await TokenRepository.getToken(oldToken.id, TokenType.REFRESH_TOKEN, oldToken.user, false);

    if (!token)
      throw new Error(t("MSG_E005"));

    await TokenRepository.deleteToken(oldToken);
    return TokenRepository.generateAuthTokens(token.user);
  } catch (error) {
    throw error;
  }
}

const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const token = await tokenService.verifyToken(resetPasswordToken, TokenType.RESET_PASSWORD);

    if (!token) return t("MSG_E005");

    const user = await UserRepository.getUser(token.user.id);

    if (!user) return t("MSG_E001");

    let updatedUser = new User(
      user.name,
      user.email,
      newPassword,
      user.role,
      user.birthDate
    );

    await UserRepository.updateUser(user.id, updatedUser);
    await tokenService.deleteToken(token);
  } catch (error) {
    throw error;
  }
}

const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const token = await tokenService.verifyToken(verifyEmailToken, TokenType.VERIFY_EMAIL) as any

    if (!token) return t("MSG_E005");

    const userData = token.__user__ as User;

    const user = await UserRepository.getUser(userData.id);

    if (!user) return t("MSG_E001");

    await UserRepository.validateEmail(user.id);
    await tokenService.deleteToken(token);
  } catch (error) {
    throw error;
  }
}

export default {
  login,
  logout,
  refreshAuthorization,
  resetPassword,
  verifyEmail,
}