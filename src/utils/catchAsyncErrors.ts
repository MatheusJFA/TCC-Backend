import { NextFunction, Request, Response } from "express";
import Logger from "../configuration/logger";

export const catchAsyncError = (fn) => (request: Request, response: Response, next: NextFunction) => {
 Promise.resolve(fn(request, response, next))
 .catch((error) => {
    Logger.error({error: JSON.stringify(error)});
    next(error);
  });
};