import i18next from 'i18next';

export class MustBeEqualError extends Error {
  constructor(parameters: string[]) {
    super(`${i18next.t("MUST_BE_EQUAL_ERROR", {field: parameters[0], fieldConfirmation: parameters[1]})}.`);
    this.name = "MustBeEqualError"
  }
}