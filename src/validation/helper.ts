import { Occupation, OccupationValues } from "@/types/occupation.type";
import { validEmail } from "@/utils/autenticator";
import { t } from "i18next";
import * as Yup from 'yup';

const createHelperSchema = Yup.object().shape({
    body: Yup.object().shape({
        user: Yup.object().shape({
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            certifications: Yup.array().optional(),
            clients: Yup.array().optional(),
            occupation: Yup.string().default(Occupation.OTHER).oneOf(OccupationValues).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.OCCUPATION") })),
        }).required()
    }),
});

const getHelperSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
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
    addCertification,
    removeCertification,
    addClient,
    removeClient
}
