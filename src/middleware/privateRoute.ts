import { Request, Response, NextFunction } from "express";
import { t } from "i18next";
import { verify } from "jsonwebtoken";
import Role from "../entity/role";


export default function privateRoute(request: Request, response: Response, next: NextFunction) {
  const { id } = request.query;
  
  const token = request.headers!.authorization!;

  const payload = verify(token, process.env.JWT_SECRET!);

  const userRole = payload.role;
  const userID = payload.sub!;

  if (userRole === Role.Moderator.ToInt() || id === userID)
    next();
  else
    response.status(403).send({ error: t("MSG_E003") });
}