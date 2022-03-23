import i18next from "i18next";

export class ServerError extends Error {
  constructor(error?: Error | any) {

    if(error instanceof Error) 
      console.log(
        `--------------------------
          Error name: ${error.name}
          Error Message: ${error.message}
          Error Stack: ${error.stack}
        --------------------------`);
     
    super(`${i18next.t("SERVER_ERROR")}`);
    this.name = "serverError"
  }
}