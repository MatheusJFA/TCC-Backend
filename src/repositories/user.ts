import { t } from "i18next";
import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import Role from "../entity/role";
import User from "../entity/user";


const createUser = async (userData: User) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const userExist = await userExists(userData.email);
    if (userExist) throw new Error(t("MSG_E000"));
    return await repository.save(userData);
  } catch (error) {
    throw error;
  }
}

const userExists = async (email: string) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { email }, relations: ["token"] });
    if (!user) return false;
    return user;
  } catch (error) {
    throw error;
  }
}

const getUser = async (id: string) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { id } });
    return user;
  } catch (error) {
    throw error;
  }
}

const getUsers = async () => {
  try {
    const repository = getConnection("default").getRepository(User);
    const users = await repository.find();
    return users;
  } catch (error) {
    throw error;
  }
}

const validateEmail = async (id: string) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { id } });
    if (!user) throw new Error(t("MSG_E001"));
    user.setEmailIsVerified();
    await repository.save(user);
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id: string, userData: User) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { id } });

    if (!user) throw new Error(t("MSG_E001"));

    if (userData.email !== user.email) {
      const alreadyExists = await userExists(userData.email);
      if (alreadyExists) throw new Error(t("MSG_E000"));
    }

    return await repository.save(userData);
  } catch (error) {
    throw error;
  }
}

const updateUserAvatar = async (id: string, avatar: string) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { id } });
    if (!user) throw new Error(t("MSG_E001"));
    user.updateImage(avatar);
    return await repository.save(user);
  } catch (error) {
    throw error;
  }
}

const updateUserRole = async (id: string, role: number) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { id } });
    if (!user) throw new Error(t("MSG_E001"));
    if (!Role.RoleExists(role)) throw new Error(t("MSG_E008", { field: "FIELDS.ROLE" }));
    user.setRole(role);
    return await repository.save(user);
  } catch (error) {
    throw error;
  }
}

const deleteUser = async (id: string) => {
  try {
    const repository = getConnection("default").getRepository(User);
    const user = await repository.findOne({ where: { id } });
    if (!user) throw new Error(t("MSG_E001"));
    return await repository.delete(id);
  } catch (error) {
    throw error;
  }
}

export default {
  createUser,
  userExists,
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
  updateUserRole,
  deleteUser,
  validateEmail,
} 