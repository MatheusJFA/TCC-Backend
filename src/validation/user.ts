import * as Yup from "Yup";
import { t } from "i18next";
import Role from "../entity/role";

const createUser = Yup.object({
  body: Yup.object({
    name: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.NAME")})),
    email: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.EMAIL")})).email(),
    birthdate: Yup.date().required(t("MSG_E009", {fields: t("FIELDS.BIRTHDATE")})).max(new Date())
  }), 
  headers: Yup.object().shape({
    authorization: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.PASSWORD")})),
  })
});

const getUser = Yup.object({
  params: Yup.object().shape({
    id: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.ID")})).uuid(),
  })
});

const updateUser = Yup.object({
  body: Yup.object().shape({
    name: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.NAME")})),
    email: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.EMAIL")})).email(),
    birthDate: Yup.date().required(t("MSG_E009", {fields: t("FIELDS.BIRTHDATE")})),
  }),
  headers: Yup.object().shape({
    authorization: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.PASSWORD")})),
  })
});

const deleteUser = Yup.object({
  params: Yup.object().shape({
    id: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.ID")})).uuid(),
  })
});

const updateRole = Yup.object({
  params: Yup.object().shape({
    id: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.ID")})).uuid(),
    role: Yup.number().required(t("MSG_E009", {fields: t("FIELDS.ROLE")})).min(Role.Visitor.ToInt()).max(Role.Administrator.ToInt()),
  })
});

const updateImage = Yup.object({
  params: Yup.object().shape({
    id: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.ID")})).uuid(),
    image: Yup.string().required(t("MSG_E009", {fields: t("FIELDS.IMAGE")})),
  })
});

export default {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateRole,
  updateImage
};