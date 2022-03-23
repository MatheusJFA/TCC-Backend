import i18next from "i18next";

export class FileNotExistError extends Error {
  constructor(fileName: string) {
    super(`${i18next.t("FILE_NOT_EXIST_ERROR")}: ${fileName}`);
    this.name = "FileNotExistError"
  }
} 