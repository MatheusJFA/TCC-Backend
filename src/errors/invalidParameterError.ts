import i18next from "i18next";

export class InvalidParameterError extends Error {
  constructor(parameter: string) {
    super(`${i18next.t("INVALID_PARAMETER_ERROR")}: ${parameter}`);
    this.name = "InvalidParameterError"
  }
}