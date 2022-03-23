import * as Yup from 'yup';
import { t } from 'i18next';

const login = Yup.object({
  headers: Yup.object().shape({
    authorization: Yup.string().required(t('MSG_E002')),
  })
});

const logout = Yup.object().shape({
  body: Yup.object().shape({
    refreshToken: Yup.string().required(t("MSG_E009", { fields: t("FIELDS.REFRESH_TOKEN") }))
  })
});

const getEmail = Yup.object().shape({
  body: Yup.object().shape({
    tokenID: Yup.string().required(t("MSG_E009", { fields: t("FIELDS.TOKEN") })),
    type: Yup.string().required(t("MSG_E009", { fields: t("FIELDS.TOKEN") }))
  })
});

const refreshToken = Yup.object().shape({
  body: Yup.object().shape({
    refreshToken: Yup.string().required(t("MSG_E009", { fields: t("FIELDS.REFRESH_TOKEN") }))
  })
});

const resetPassword = Yup.object().shape({
  headers: Yup.object().shape({
    authorization: Yup.string().required(t('MSG_E002')),
  })
});

const forgotPassword = Yup.object().shape({
  body: Yup.object().shape({
    email: Yup.string().required(t("MSG_E009", { fields: t("FIELDS.REFRESH_TOKEN") })).email()
  })
});

const verifyEmail = Yup.object().shape({
  body: Yup.object().shape({
    token: Yup.string().required(t("MSG_E009", { fields: t("FIELDS.TOKEN") }))
  })
});

export default {
  login,
  logout,
  getEmail,
  resetPassword,
  refreshToken,
  forgotPassword,
  verifyEmail
}
