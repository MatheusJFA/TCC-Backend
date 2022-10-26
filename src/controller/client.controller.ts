import Client, { IClient } from "@/entity/client.entity";
import HelperService from "@/service/helper.service";
import ClientService from "@/service/client.service";
import { Role } from "@/types/role.type";
import { getPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";
import { IUser } from "@/entity/user.entity";
import { SexValues } from "@/types/sex.type";

class ClientController {
    createClient = LogAsyncError(async (request: Request, response: Response) => {
        const { name, email, birthdate, sex, height, weight, helpers } = request.body.user;
        const password = getPassword(request.headers!.authorization!);

        const image = request.file?.filename || "../assets/image/default-avatar.png";
        let client =
            await ClientService.createClient(name, email, password, birthdate, sex, Role.USER, height, weight, helpers, image);

        return response
            .status(httpStatus.CREATED)
            .json({ user: client.toJSON() });
    });

    getClient = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;

        const client = await ClientService.getClientByID(id);

        return response
            .status(httpStatus.OK)
            .json({ user: client.toJSON() });
    });

    getClients = LogAsyncError(async (request: Request, response: Response) => {
        const paginate = request.body.pagination;
        const clients = await ClientService.getClients(paginate);

        return response
            .status(httpStatus.OK)
            .json(clients);
    });

    getClientDiet = LogAsyncError(async (request: Request, response: Response) => {
        const id: string = request.params.id;

        const data = await ClientService.getClientDiet(id);

        return response.status(httpStatus.OK).send({ data });
    });

    updateClient = LogAsyncError(async (request: Request, response: Response) => {
        const id: string = request.params.id;
        const { name, email, birthdate, sex, height, weight } = request.body.user;

        const image = request.file?.filename || "../assets/image/default-avatar.png";

        let user: Client = await ClientService.getClientByID(id);

        if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

        const updatedUser = await ClientService.updateClient(id, { name, email, birthdate, sex, image } as IUser, height, weight)

        return response
            .status(httpStatus.OK)
            .json({ user: updatedUser.toJSON() })
    });

    deleteClient = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;

        let user: Client = await ClientService.getClientByID(id);

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

        let user: Client = await ClientService.getClientByID(id);

        if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

        user.updateUser({ role });
        return response
            .status(httpStatus.CREATED)
            .json({ message: t("SUCCESS.OK") })
    });

    addHelper = LogAsyncError(async (request: Request, response: Response) => {
        const { clientId, helperId } = request.body;

        let client = await ClientService.getClientByID(clientId);
        let helper = await HelperService.getHelperByID(helperId);

        await ClientService.addHelper(client, helper);

        return response.status(httpStatus.OK)
    });

    removeHelper = LogAsyncError(async (request: Request, response: Response) => {
        const { clientId, helperId } = request.body;

        let client = await ClientService.getClientByID(clientId);

        await ClientService.removeHelper(client, helperId);

        return response.status(httpStatus.OK)
    });

    getSexValues = LogAsyncError(async (request: Request, response: Response) => {
        const sexValues = SexValues.map(s => s.toLowerCase().replace(/\b(\w)/g, x => x.toUpperCase()));
        return response.status(httpStatus.OK).send({ sexValues })
    });
}

export default new ClientController();