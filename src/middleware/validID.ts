import { Request, Response, NextFunction } from "express";
import { t } from "i18next";
import uuid from "uuid";

export default function ValidateID(request: Request, response: Response, next: NextFunction) {
  const { id } = request.params;

  if (!uuid.validate(id))
    return response.status(400).send({ error: t("MSG_E006") });

  next();
}