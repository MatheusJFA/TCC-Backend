import Certification from "@/entity/certification.entity";
import Helper, { IHelper } from "@/entity/helper.entity";
import User, { IUser } from "@/entity/user.entity";
import ClientService from "@/service/client.service";
import HelperService from "@/service/helper.service";
import UserService from "@/service/user.service";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";

class HelperController {
    createHelper = LogAsyncError(async (request: Request, response: Response) => {
        const { email, certifications, clients, occupation } = request.body.user;
        let user: User = await UserService.getUserByEmail(email);
        let helper = await HelperService.createHelper(user, certifications, clients, occupation);

        return response
            .status(httpStatus.CREATED)
            .json({ user: helper.user.toJSON() });
    });

    addClient = LogAsyncError(async (request: Request, response: Response) => {
        const helperId = request.params.id;
        const { clientId } = request.body;

        let helper = await HelperService.getHelperByID(helperId);
        let client = await ClientService.getClientByID(clientId);

        await HelperService.addClient(helper, client);

        return response.send(httpStatus.OK)
    });

    removeClient = LogAsyncError(async (request: Request, response: Response) => {
        const helperId = request.params.id;
        const { clientId } = request.body;

        let helper = await HelperService.getHelperByID(helperId);

        await HelperService.removeClient(helper, clientId);

        return response.send(httpStatus.OK)
    });

    addCertification = LogAsyncError(async (request: Request, response: Response) => {
        const helperId = request.params.id;

        const {title, date} = request.body;
        const image = request.file?.filename || "../assets/image/default-avatar.png";

        const helper = await HelperService.getHelperByID(helperId);
        await HelperService.addCertification(helper, new Certification(title, image, date));

        return response.send(httpStatus.OK)
    });

    removeCertification = LogAsyncError(async (request: Request, response: Response) => {
        const helperId = request.params.id;

        const {title, date} = request.body.certification;
        const image = request.file?.filename || "../assets/image/default-avatar.png";

        const helper = await HelperService.getHelperByID(helperId);
        await HelperService.addCertification(helper, new Certification(title, image, date));

        return response.send(httpStatus.OK)
    });
}

export default new HelperController();