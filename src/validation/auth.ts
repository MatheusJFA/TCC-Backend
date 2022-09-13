import * as Yup from 'yup';
import { t } from 'i18next';
import { getEmailAndPassword, tokenVerification, validEmail, validPassword } from '@/utils/autenticator';
import TokenService from '@/service/token.service';

const loginSchema = Yup.object().shape({
    headers: Yup.object().shape({
        authorization: Yup.string().required().test('login-test', () => t('ERROR.USER.INVALID_CREDENTIALS'), (value: any) => {
            const [email, password] = getEmailAndPassword(value);
            return validEmail(email) && validPassword(password);
        }),
    }).required(),
});


const logoutSchema = Yup.object().shape({
    headers: Yup.object().shape({
        authorization: Yup.string().required()
            .test('is-jwt', () => t('ERROR.TOKEN.INVALID'), (value: any) => {
                return TokenService.verifyToken(value);
            })
    }).required(),
});

const refreshTokenSchema = Yup.object().shape({
    headers: Yup.object().shape({
        authorization: Yup.string()
            .test('is-jwt', t("ERROR.TOKEN.INVALID"), (value: any) => {
                return TokenService.verifyToken(value);
            }).required(),
    }).required(),
});

const sendForgotPasswordEmailSchema = Yup.object().shape({
    headers: Yup.object().shape({
        authorization: Yup.string()
            .test('is-jwt', t("ERROR.TOKEN.INVALID"), (value: any) => {
                return TokenService.verifyToken(value);
            }).required(),
    }).required(),
});

const resetPasswordSchema = Yup.object().shape({
    body: Yup.object().shape({
        token: Yup.string()
            .test('is-jwt', t("ERROR.TOKEN.INVALID"), (value: any) => {
                return TokenService.verifyToken(value);
            }).required(),
    }).required(),
    headers: Yup.object().shape({
        authorization: Yup.string().required(),
    }).required(),
});

const sendVerificationEmailSchema = Yup.object().shape({
    body: Yup.object().shape({
        email: Yup.string().email(t("ERROR.PARAMETERS.INVALID", { parameter: t("FIELD.USER.EMAIL") })).required(),
    }).required(),
});

const verifyEmail = Yup.object().shape({
    body: Yup.object().shape({
        token: Yup.string().test('is-jwt', t("ERROR.TOKEN.INVALID"), (value: any) => {
            return TokenService.verifyToken(value);

        }).required(),
    }).required(),
});

export default {
    loginSchema,
    logoutSchema,
    refreshTokenSchema,
    sendForgotPasswordEmailSchema,
    resetPasswordSchema,
    sendVerificationEmailSchema,
    verifyEmail
}