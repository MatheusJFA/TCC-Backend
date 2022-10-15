import { Role, RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { t } from "i18next";
import * as Yup from 'yup';

const createClientSchema = Yup.object().shape({
    body: Yup.object().shape({
        user: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            sex: Yup.string().oneOf(SexValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.SEX") })),
            role: Yup.string().default(Role.USER).oneOf(RoleValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.ROLE") })),
            image: Yup.string().optional(),
            height: Yup.number().positive().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.HEIGHT") })),
            weight: Yup.number().positive().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.WEIGHT") })),
        }).required(),
    }),
    headers: Yup.object().shape({
        authorization: Yup.string()
            .test('valid-password', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.PASSWORD") }), (value: any) => {
                const password = getPassword(value);
                return validPassword(password);
            }),
    }).required()
});

const getClientSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
});


const addHelperSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        helper: Yup.string().uuid().required(),
    }),
});
const updateClientSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        user: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            role: Yup.string().default(Role.USER).oneOf(RoleValues).optional(),
            image: Yup.string().optional(),
            height: Yup.number().positive().max(3.00).min(0.50).optional(),
            weight: Yup.number().positive().max(300.00).min(7.00).optional(),
        }),
    }),
});

const deleteClientSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    })
});

const changeRoleSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }),
    body: Yup.object().shape({
        role: Yup.string().oneOf(RoleValues).required(),
    }),
});


export default {
    createClientSchema,
    getClientSchema,
    updateClientSchema,
    deleteClientSchema,
    changeRoleSchema,
    addHelperSchema,
}