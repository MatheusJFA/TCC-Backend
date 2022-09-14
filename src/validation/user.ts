import { Occupation, OccupationValues } from "@/types/occupation.type";
import { Role, RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";
import { getPassword, validPassword } from "@/utils/autenticator";
import i18n, { t } from "i18next";
import * as Yup from 'yup';

const createUserSchema = Yup.object().shape({
    body: Yup.object().shape({
        user: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().email(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            sex: Yup.string().oneOf(SexValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.SEX") })),
            height: Yup.number().min(0.50).max(2.60).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.HEIGHT") })),
            weight: Yup.number().min(5.00).max(600.00).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.WEIGHT") })),
            role: Yup.string().default(Role.USER).oneOf(RoleValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.ROLE") })),
            occupation: Yup.string().default(Occupation.USER).oneOf(OccupationValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.OCCUPATION") })),
            certification: Yup.string().optional(),
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
            email: Yup.string().email(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            height: Yup.number().min(0.50).max(2.60).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.HEIGHT") })),
            weight: Yup.number().min(5.00).max(600.00).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.WEIGHT") })),
            role: Yup.string().default(Role.USER).oneOf(RoleValues).optional(),
            occupation: Yup.string().default(Occupation.USER).oneOf(OccupationValues).optional(),
            certification: Yup.string().optional(),
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
