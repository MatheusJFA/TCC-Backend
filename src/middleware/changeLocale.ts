import { Request, Response, NextFunction } from "express";
import i18next from "i18next";

export default function changeLocale(request: Request, response: Response, next: NextFunction) {
  const locale = request.headers["accept-language"] as string;
  
  if(locale)
    i18next.changeLanguage(locale);
  
  next();
}