import { Role, RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { t } from "i18next";
import * as Yup from 'yup';

const createUserSchema = Yup.object().shape({
    body: Yup.object().shape({
        user: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            sex: Yup.string().oneOf(SexValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.SEX") })),
            role: Yup.string().default(Role.USER).oneOf(RoleValues).optional(   ),
        image: Yup.string().optional()
    }).required()
}),
    headers: Yup.object().shape({
        authorization: Yup.string()
            .test('valid-password', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.PASSWORD") }), (value: any) => {
                const password = getPassword(value);
                return validPassword(password);
            }),
    })
});

const getUserSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
});

const updateUserSchema = Yup.object().shape({
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
            image: Yup.string().optional()
        }),
    }),
});

const deleteUserSchema = Yup.object().shape({
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
    createUserSchema,
    getUserSchema,
    updateUserSchema,
    deleteUserSchema,
    changeRoleSchema
}
