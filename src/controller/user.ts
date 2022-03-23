import UserRepository from "../repositories/user";
import { Request, Response } from "express";

import User from "../entity/user";
import Role from "../entity/role";

import { catchAsyncError } from "../utils/catchAsyncErrors";

import { userView } from "../view/user";
import { t } from "i18next";
import fileManager from "../utils/fileManager";

import { validPassword } from "../validation/custom/password";

const createUser = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const { name, email, birthdate } = request.body;
    const [, hash] = request.headers?.authorization?.split(" ") as string[];
    const password = Buffer.from(hash, "base64").toString("utf-8");

    if (!validPassword(password))
      return response.status(400).json({ error: t("MSG_E011") });

    const newUser = new User(name, email, password, Role.User.ToInt(), birthdate, new Date(), new Date());

    const createdUser = await UserRepository.createUser(newUser);

    if (!createdUser) return response.status(400).json(t("MSG_E000"));

    const user = userView(createdUser);

    response.status(201).json({
      message: t("MSG_S004", { action: t("ACTIONS.CREATE") }),
      user,
    });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const getUser = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const id = request.params.id;

    const user = await UserRepository.getUser(id);

    if (!user) return response.status(404).send({ message: t("MSG_E001") });

    return response.status(201).send(userView(user));
  } catch (error) {
    return response.status(500).send({ error: error.message });
  }
});

const getUsers = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const users = await UserRepository.getUsers();
    return response.status(201).send(users.map(userView));
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const deleteUser = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const id = request.params.id;

    if (!id) return response.status(400).send({ message: t("MSG_E001") });

    const user = await UserRepository.getUser(id);

    if (!user) return response.status(404).send({ message: t("MSG_E001") });

    const defaultImage = `${process.env.BACKEND_URL}/files/default.png`;

    if (user.image !== defaultImage)
      fileManager.deleteFile(user.image);

    await UserRepository.deleteUser(id);
    return response.status(201).send({ message: t("MSG_S004", { action: t("ACTIONS.DELETE") }) });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const updateUser = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const id = request.params.id;

    const { name, email, birthdate } = request.body;
    const [, hash] = request.headers?.authorization?.split(" ") as string[];
    const password = Buffer.from(hash, "base64").toString("utf-8");

    const updatedUser = new User(name, email, password, Role.User.ToInt(), birthdate);

    await updatedUser.hashPassword();

    await UserRepository.updateUser(id, updatedUser);
    return response.status(201).send(userView(updatedUser));
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

const updateRole = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const { id, role } = request.query;

    await UserRepository.updateUserRole(String(id), Number(role));
    return response.status(201).send({ message: t("MSG_S004", { action: t("ACTIONS.UPDATE") }) });
  } catch (error) {
    return response.status(500).send({ error: error.message });
  }
});

const updateImage = catchAsyncError(async (request: Request, response: Response) => {
  try {
    const { id } = request.query;
    const requestImage = request.file as Express.Multer.File;

    await UserRepository.updateUserAvatar(String(id), requestImage.filename);
    return response.status(201).send({ message: t("MSG_S004", { action: t("ACTIONS.UPDATE") }) });
  } catch (error) {
    return response.status(500).send({ error: t("SERVER_ERROR") });
  }
});

export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  updateRole,
  updateImage
};