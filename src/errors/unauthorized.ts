import i18next from "i18next"

export class UnauthorizedError extends Error {
  constructor() {
    super(`${i18next.t("UNAUTHORIZED_ERROR")}`)
    this.name = 'UnauthorizedError'
  }
}