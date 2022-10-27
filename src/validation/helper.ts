import { Occupation, OccupationValues } from "@/types/occupation.type";
import { Role, RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { t } from "i18next";
import * as Yup from 'yup';

const createHelperSchema = Yup.object().shape({
    body: Yup.object().shape({
        user: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            sex: Yup.string().oneOf(SexValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.SEX") })),
            role: Yup.string().default(Role.HELPER).oneOf(RoleValues).optional(),
            image: Yup.string().optional(),
            certifications: Yup.array().optional(),
            clients: Yup.array().optional(),
            occupation: Yup.string().default(Occupation.OTHER).oneOf(OccupationValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.OCCUPATION") })),
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
        user: Yup.object().shape({
            name: Yup.string().required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.NAME") })),
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            sex: Yup.string().oneOf(SexValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.SEX") })),
            birthdate: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
            role: Yup.string().default(Role.USER).oneOf(RoleValues).optional(),
            image: Yup.string().optional(),
            occupation: Yup.string().default(Occupation.OTHER).oneOf(OccupationValues).optional()
        }),
    }),
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

const addClient = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        clientId: Yup.string().uuid().required(),
    })
})

const removeClient = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        clientId: Yup.string().uuid().required(),
    })
})

const addCertification = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        certification: Yup.object().shape({
            title: Yup.string().required(),
            date: Yup.date().max(new Date()).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.BIRTHDATE") })),
        })
    })
})

const removeCertification = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        certification: Yup.object().shape({
            certificationId: Yup.string().uuid().required(),
        })
    })
})

export default {
    createHelperSchema,
    getHelperSchema,
    updateHelperSchema,
    deleteHelperSchema,
    changeRoleSchema,
    addCertification,
    removeCertification,
    addClient,
    removeClient
}
