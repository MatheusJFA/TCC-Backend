import { NextFunction, Request, Response } from "express";
import Logger from "../configuration/logger";

export const LogAsyncError = (fn: Function) => (request: Request, response: Response, next: NextFunction) => {
  Promise.resolve(fn(request, response, next))
    .catch((error) => {
      Logger.error({ message: error.message, stack: error.message });
      next(error);
    });

}