import Certification from "@/entity/certification.entity";
import Client, { IClient } from "@/entity/client.entity";
import User, { IUser } from "@/entity/user.entity";
import ClientService from "@/service/client.service";
import HelperService from "@/service/helper.service";
import UserService from "@/service/user.service";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";

class ClientController {
    createClient = LogAsyncError(async (request: Request, response: Response) => {
        const { email, height, weight, helpers } = request.body.user;
        let user: User = await UserService.getUserByEmail(email);
        let client = await ClientService.createClient(user, height, weight, helpers);

        return response
            .status(httpStatus.CREATED)
            .json({ user: client.user.toJSON() });
    });

    getClient = LogAsyncError(async (request: Request, response: Response) => {
        const id = request.params.id;

        const client = await ClientService.getClientByID(id);
        
        return response
            .status(httpStatus.OK)
            .json({ user: client.toJSON() });
    });

    addHelper = LogAsyncError(async (request: Request, response: Response) => {
        const { clientId, helperId } = request.body;

        let client = await ClientService.getClientByID(clientId);
        let helper = await HelperService.getHelperByID(helperId);

        await ClientService.addHelper(client, helper);

        return response.send(httpStatus.OK)
    });

    removeHelper = LogAsyncError(async (request: Request, response: Response) => {
        const { clientId, helperId } = request.body;

        let client = await ClientService.getClientByID(clientId);

        await ClientService.removeHelper(client, helperId);

        return response.send(httpStatus.OK)
    });

    updateClient = LogAsyncError(async (request: Request, response: Response) => {
        const { clientId, height, weight } = request.body;

        let client = await ClientService.getClientByID(clientId);

        await ClientService.updateClient(client, height, weight);

        return response.send(httpStatus.OK)
    });

}

export default new ClientController();