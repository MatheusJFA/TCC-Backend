import { Router } from "express";
import validate from "../middleware/validateFields";
import validToken from "../middleware/validToken";

import authSchema from "../validation/auth";

import authController from "../controller/auth";

const router = Router();

router.post("/login", validate(authSchema.login), authController.login);
router.post("/logout", validate(authSchema.logout), authController.logout);
router.post("/me", authController.me);
router.post("/refresh-token", validate(authSchema.refreshToken), authController.refreshToken);
router.post("/forgot-password", validate(authSchema.forgotPassword), authController.forgetPassword);
router.post("/getEmail", validate(authSchema.getEmail), authController.getEmail);
router.post("/reset-password", validate(authSchema.resetPassword), authController.resetPassword);
router.post("/send-verification-email", authController.sendVerificationEmail);
router.post("/verify-email", validate(authSchema.verifyEmail), authController.verifyEmail);

export default router;