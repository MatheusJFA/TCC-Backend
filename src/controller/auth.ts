import { Request, Response } from "express";
import { t } from "i18next";
import { userView } from "../view/user";
import { JwtPayload, verify } from "jsonwebtoken";

//Services 
import AuthRepository from "../repositories/auth";
import TokenRepository from "../repositories/token";
import EmailRepository from "../repositories/email";
import UserRepository from "../repositories/user";

import { catchAsyncError } from "../utils/catchAsyncErrors";
import { getFirstName } from "../utils/text";
import { TokenType } from "../enums/token";
import Token from "../entity/token";

const login = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const [, hash] = request.headers?.authorization?.split(" ") as string[];
    const [email, password] = Buffer.from(hash, "base64").toString("utf-8").split(":");

    const user = await AuthRepository.login(email, password);

    if (!user) return response.status(401).send({ message: t("MSG_E002") });

    if (!user.getEmailIsVerified()) return response.status(401).send({ message: t("VERIFY_EMAIL") });

    const tokens = await TokenRepository.generateAuthTokens(user);

    response.status(200).json({
      user: userView(user),
      tokens: tokens
    });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const logout = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const authorization = request.headers!.authorization!;

    const payload = verify(authorization, process.env.JWT_SECRET!) as JwtPayload;

    const userID = payload.sub!;
    const user = await UserRepository.getUser(userID);

    if (!user) return response.status(404).send({ message: t("MSG_E001") });

    await AuthRepository.logout(authorization, user);
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const refreshToken = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const authorization = request.headers!.authorization!;

    if (!authorization) return response.status(401).send({ message: t("MSG_E004") });

    const newtokens = await AuthRepository.refreshAuthorization(authorization!);
    return response.status(201).send({
      tokens: newtokens
    })
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const me = async (request: Request, response: Response) => {
  try {
    const token = request.body.token;

    if (!token) return response.status(401).send({ message: t("MSG_E004") });

    const payload = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (TokenRepository.expiredToken(String(payload.exp))) {
      await TokenRepository.deleteToken(token);
      return response.status(400).send({ valid: false });
    } else {
      const user = payload;

      return response.status(201).send({
        valid: true,
        user: {
          id: user.sub,
          role: user.role,
        }
      });
    }
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
};

const getEmail = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const { tokenID, type } = request.body;

    const tokenType = TokenType[type as keyof typeof TokenType];

    const token = await TokenRepository.getTokenByID(tokenID, tokenType) as any;

    if (!token) return response.status(400).send({ message: t("MSG_E004") });

    return response.status(200).send({ email: token.__user__.email });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});


const forgetPassword = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const email = request.body.email;
    const user = await UserRepository.userExists(email) as any;

    if (!user) return response.status(404).send({ message: t("MSG_E001") });

    if (!user.getEmailIsVerified()) return response.status(401).send({ message: t("VERIFY_EMAIL") });

    const existingTokens = user.token;

    const tokenAlreadyExists = existingTokens.filter((token: Token) => token.type === TokenType.RESET_PASSWORD && token.blacklisted === false);

    let resetPasswordToken = null;

    if (tokenAlreadyExists.length === 0 || !tokenAlreadyExists)
      resetPasswordToken = await TokenRepository.generateResetPasswordToken(email);

    EmailRepository.resetPasswordEmail(getFirstName(user.name), email, resetPasswordToken || tokenAlreadyExists[0].id);
    response.status(201).send({ message: t("FORGET_PASSOWRD") });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const resetPassword = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const token = request.body.token;
    const [, hash] = request.headers?.authorization?.split(" ") as string[];
    const password = Buffer.from(hash, "base64").toString("utf-8");

    if (!token) return response.status(400).send({ message: t("MSG_E004") });

    if (TokenRepository.expiredToken(token)) return response.status(400).send({ message: t("MSG_E005") });

    if (!password) return response.status(400).send({ message: t("MSG_E009", { field: t("FIELDS.PASSWORD") }) });

    await AuthRepository.resetPassword(token, password);
    return response.status(201).send();
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const sendVerificationEmail = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const email = request.body.email;

    const user = await UserRepository.userExists(email);

    if (!user) return response.status(404).send({ message: t("MSG_E001") });

    const verifyEmailToken = await TokenRepository.generateVerifyEmailToken(user);
    EmailRepository.sendVerificationEmail(getFirstName(user.name), email, verifyEmailToken);
    return response.status(201).send({ message: t("VERIFY_EMAIL") });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const verifyEmail = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const tokenID = request.body.token as string;

    if (!tokenID)
      return response.status(400).send({ message: t("MSG_E004") });

    const token = await TokenRepository.getTokenByID(tokenID, TokenType.VERIFY_EMAIL) as any;

    if (!token) return response.status(400).send({ message: t("MSG_E004") });

    if (TokenRepository.expiredToken(token.expiresIn)) return response.status(400).send({ message: t("MSG_E005") });

    await AuthRepository.verifyEmail(tokenID);

    const email = token.__user__.email;

    if (!email) return response.status(404).send({ message: t("MSG_E001") });

    return response.status(201).send({ email });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

export default {
  login,
  logout,
  refreshToken,
  me,
  getEmail,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
}