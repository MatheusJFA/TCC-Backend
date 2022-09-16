
import { IClient } from "@/entity/client.entity";
import UserService from "@/service/client.service";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class NutritionController {
    URL_BASE = "https://wger.de/api/v2/";

}

export default new NutritionController();


