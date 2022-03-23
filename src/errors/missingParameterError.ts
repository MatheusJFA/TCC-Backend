import i18next from "i18next";

export class MissingParameterError extends Error {
  constructor(parameter: string) {
    super(`${i18next.t("MISSING_PARAMETER_ERROR")}: ${parameter}`);
    this.name = "MissingParameterError"
  }
}