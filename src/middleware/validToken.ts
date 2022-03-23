import { Request, Response, NextFunction } from "express";
import { t } from "i18next";
import { verify } from "jsonwebtoken";
import moment from "moment";

export default function validToken(request: Request, response: Response, next: NextFunction) {
  const token = request.headers!.authorization!;

  if(!token)
    return response.status(401).send({ error: t("UNAUTHORIZED_ERROR") });
  
  const payload = verify(token, process.env.JWT_SECRET!);
 
  const expiredToken = moment().isAfter(payload.exp);
  
  if(expiredToken)
    return response.status(401).send({ error: t("MSG_E005") });

  next();
}