import { IClient } from "@/entity/client.entity";
import ClientService from "@/service/client.service";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class ClientController {
    createClient = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const { name, email, birthdate, sex, height, weight, occupation, certification } = request.body.client;
            const password = getPassword(request.headers!.authorization!);

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            const client = await ClientService.createClient({ name, email, birthdate, password, sex, role: "USER", height, weight, image } as IClient);
            return response
                .status(httpStatus.CREATED)
                .json({ client: client.toJSON() });
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });


    getClient = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id as string;

            let client: any;

            try {
                client = await ClientService.getClientByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }
            return response
                .status(httpStatus.OK)
                .json({ client: client.toJSON() });
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    getClients = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const paginate = request.body.pagination;
            const clients = await ClientService.getClients(paginate);
            return response
                .status(httpStatus.OK)
                .json(clients);
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    updateClient = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id: string = request.params.id;
            const { name, email, birthdate, sex, height, weight } = request.body.client;

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            let client: any;

            try {
                client = await ClientService.getClientByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            const updatedClient = await ClientService.updateClient(id, { name, email, birthdate, sex, image, height, weight  } as IClient)

            return response
                .status(httpStatus.OK)
                .json({ client: updatedClient.toJSON() })
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    deleteClient = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            let client: any;

            try {
                client = await ClientService.getClientByID(id);
            } catch (error) {
                if (!client) return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            client.invalidate()
            await client.save();
            return response
                .status(httpStatus.OK)
                .json({ message: t("SUCCESS.MESSAGE", { resource: t("RESOURCES.USER"), action: t("ACTION.DELETE") }) });
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    changeRole = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            const role = request.body.role;

            let client: any;

            try {
                client = await ClientService.getClientByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            client.updateClient({ role });
            return response
                .status(httpStatus.CREATED)
                .json({ message: t("SUCCESS.OK") })
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

}

export default new ClientController();