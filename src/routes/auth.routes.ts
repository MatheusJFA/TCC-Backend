import AuthController from "@/controller/auth.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";

import authSchema from "@validation/auth";

const router = Router();

router.post("/login",
    validateSchema(authSchema.loginSchema),
    AuthController.login);

router.post("/logout",
    validateSchema(authSchema.logoutSchema),
    AuthController.logout)

router.post("/refresh-token",
    validateSchema(authSchema.refreshTokenSchema),
    AuthController.refreshToken)

router.post("/send-verification-email",
    validateSchema(authSchema.sendVerificationEmailSchema),
    AuthController.sendVerificationEmail)

router.post("/verify-email",
    validateSchema(authSchema.verifyEmail),
    AuthController.verifyEmail)

router.post("/send-forgot-password-email",
    validateSchema(authSchema.sendForgotPasswordEmailSchema),
    AuthController.sendforgotPasswordEmail)

router.post("/reset-password",
    validateSchema(authSchema.resetPasswordSchema),
    AuthController.resetPassword)

export default router;