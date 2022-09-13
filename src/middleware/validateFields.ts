import Logger from "@/configuration/logger";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { t } from "i18next";
import { AnySchema } from "yup";

const validateSchema = (schema: AnySchema) => async (request: Request, response: Response, next: NextFunction) => {
  try {

    await schema.validate({
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
    }, { abortEarly: false })
      .catch((error: any) => {
        Logger.error(error.message);
        return response
          .status(httpStatus.BAD_REQUEST)
          .json({ message: error.message || t("ERROR.PARAMETERS.INVALID_GENERIC") });
      });

    next();

  } catch (error: any) {
    return response
      .status(httpStatus.BAD_REQUEST)
      .json({ message: error.message });
  }
};

export default validateSchema;