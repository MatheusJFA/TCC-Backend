import { Router } from "express";

import multer from "multer";
import multerConfiguration from "../configuration/multer";

import validRole from "../middleware/validRole";
import privateRoute from "../middleware/privateRoute";

import validate from "../middleware/validateFields";
import userSchema from "../validation/user";

import userController from "../controller/user";
import Role from "../entity/role";

const router = Router();

router.post("/", validate(userSchema.createUser), userController.createUser);
router.get("/:id", privateRoute, userController.getUser);
router.get("/", validRole(Role.Moderator), validate(userSchema.getUser), userController.getUsers);
router.delete("/:id", validate(userSchema.createUser), userController.createUser);
router.put("/:id", validate(userSchema.createUser), userController.createUser);
router.put("/id", multer(multerConfiguration).single("file"), privateRoute, validate(userSchema.updateImage), userController.updateImage);
router.patch("/:id", validate(userSchema.updateRole), validRole(Role.Administrator), userController.updateRole);

export default router;