import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { t } from "i18next";
import Role from '../entity/role';

export default function validRole(role: Role) {
  return function (request: Request, response: Response, next: NextFunction) {
    const token = request.headers!.authorization!;

    const payload = verify(token, process.env.JWT_SECRET!);

    const userRole = payload.role;

    if (userRole >= role)
      next();
    else
      response.status(403).send({ error: t("MSG_E003") });
  }
}