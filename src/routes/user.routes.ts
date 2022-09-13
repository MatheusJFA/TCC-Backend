import UserController from "@/controller/user.controller";
import { minimunRole } from "@/middleware/minimunRole";
import { validID } from "@/middleware/validID";
import { Router } from "express";

import userSchema from "@validation/user";
import validateSchema from "@middleware/validateFields";

const router = Router();

router.post("/",
    validateSchema(userSchema.createUserSchema),
    UserController.createUser);

router.get("/:id",
    validID,
    validateSchema(userSchema.getUserSchema),
    UserController.getUser);

router.get("/",
    minimunRole("MODERATOR"),
    UserController.getUsers);

router.delete("/:id",
    validateSchema(userSchema.deleteUserSchema),
    UserController.deleteUser);

router.put("/:id",
    validateSchema(userSchema.updateUserSchema),
    UserController.updateUser);

router.patch("/:id",
    validateSchema(userSchema.changeRoleSchema),
    minimunRole("MODERATOR"),
    UserController.changeRole);

export default router;