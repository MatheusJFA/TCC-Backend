import { Role, RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { t } from "i18next";
import * as Yup from 'yup';

const createClientSchema = Yup.object().shape({
    body: Yup.object().shape({
        user: Yup.object().shape({
            email: Yup.string().test('valid-email', () => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") }), (value: any) => {
                return validEmail(value)
            }).required(() => t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })),
            height: Yup.number().positive().max(3.00).min(0.50).required(),
            weight: Yup.number().positive().max(300.00).min(7.00).required(),
        }).required()
    }),
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
        height: Yup.number().positive().max(3.00).required(),
        weight: Yup.number().positive().max(300.00).required(),
    })
});

export default {
    createClientSchema,
    getClientSchema,
    addHelperSchema,
    updateClientSchema
}