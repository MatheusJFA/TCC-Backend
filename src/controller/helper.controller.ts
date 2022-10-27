import Certification from "@/entity/certification.entity";
import Helper from "@/entity/helper.entity";
import { IUser } from "@/entity/user.entity";
import ClientService from "@/service/client.service";
import HelperService from "@/service/helper.service";
import { Role } from "@/types/role.type";
import { getPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class HelperController {
    createHelper = LogAsyncError(async (request: Request, response: Response) => {
        const { name, email, birthdate, sex, certifications, clients, occupation } = request.body.user;
        const password = getPassword(request.headers!.authorization!);

        const image = request.file?.filename || "../assets/image/default-avatar.png";

        let helperAlreadyExists = await HelperService.returnHelperByEmail(email);
        
        if (helperAlreadyExists) return response.status(httpStatus.BAD_REQUEST).send({message: t("ERROR.USER.ALREADY_EXISTS")})

        let helper = await HelperService.createHelper(name, email, password, new Date(birthdate), sex, Role.HELPER, certifications, occupation, clients, image);

        return response
            .status(httpStatus.CREATED)
            .json({ user: helper.toJSON() });
    });

    getHelper = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id as string;
        let helper: Helper = await HelperService.getHelperByID(id);
        return response
            .status(httpStatus.OK)
            .json({ user: helper.toJSON() });
    });

    getHelpers = LogAsyncError(async (request: Request, response: Response) => {
        const paginate = request.body.pagination;
        const users = await HelperService.getHelpers(paginate);
        return response
            .status(httpStatus.OK)
            .json(users);
    });


    updateHelper = LogAsyncError(async (request: Request, response: Response) => {
        const id: string = request.params.id;
        const { name, email, birthdate, sex, occupation } = request.body.user;

        const image = request.file?.filename || "../assets/image/default-avatar.png";

        let user: Helper = await HelperService.getHelperByID(id);

        if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

        const updatedUser = await HelperService.updateHelper(id, { name, email, birthdate, sex, image } as IUser)

        return response
            .status(httpStatus.OK)
            .json({ user: updatedUser.toJSON() })
    });

    deleteHelper = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;

        let user: Helper = await HelperService.getHelperByID(id);

        if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

        user.invalidate()
        await user.save();
        return response
            .status(httpStatus.OK)
            .json({ message: t("SUCCESS.MESSAGE", { resource: t("RESOURCES.USER"), action: t("ACTION.DELETE") }) });
    });

    changeRole = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;
        const role = request.body.role;

        let user: Helper = await HelperService.getHelperByID(id);

        if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

        user.updateUser({ role });
        return response
            .status(httpStatus.CREATED)
            .json({ message: t("SUCCESS.OK") })
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

        const { title, date } = request.body;
        const image = request.file?.filename || "../assets/image/default-avatar.png";

        const helper = await HelperService.getHelperByID(helperId);
        await HelperService.addCertification(helper, new Certification(title, image, date));

        return response.send(httpStatus.OK)
    });

    removeCertification = LogAsyncError(async (request: Request, response: Response) => {
        const helperId = request.params.id;

        const { title, date } = request.body.certification;
        const image = request.file?.filename || "../assets/image/default-avatar.png";

        const helper = await HelperService.getHelperByID(helperId);
        await HelperService.addCertification(helper, new Certification(title, image, date));

        return response.send(httpStatus.OK)
    });
}

export default new HelperController();