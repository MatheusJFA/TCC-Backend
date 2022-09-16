import { Occupation, OccupationValues } from "@/types/occupation.type";
import { Role, RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import i18n, { t } from "i18next";
import * as Yup from 'yup';

const createHelperSchema = Yup.object().shape({
    body: Yup.object().shape({
        helper: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            sex: Yup.string().oneOf(SexValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.SEX") })),
            role: Yup.string().default(Role.HELPER).oneOf(RoleValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.ROLE") })),
            occupation: Yup.string().default(Occupation.OTHER).oneOf(OccupationValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.OCCUPATION") })),
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

const getHelperSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
});

const updateHelperSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        helper: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            role: Yup.string().default(Role.HELPER).oneOf(RoleValues).optional(),
            occupation: Yup.string().default(Occupation.OTHER).oneOf(OccupationValues).optional(),
            certification: Yup.string().optional(),
            image: Yup.string().optional()
        }),
    }),
});

const addCertification = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }),

    body: Yup.object().shape({
        certification: Yup.object({
            title: Yup.string().required(),
            image: Yup.string().url().required(),
            date: Yup.date().max(new Date()).required()
        })
    })
});


const deleteHelperSchema = Yup.object().shape({
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
    createHelperSchema,
    getHelperSchema,
    updateHelperSchema,
    addCertification,
    deleteHelperSchema,
    changeRoleSchema
}
