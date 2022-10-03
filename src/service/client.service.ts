import { t } from "i18next";
import Database from "@/configuration/database";
import Client, { IClient } from "@/entity/client.entity";
import User from "@/entity/user.entity";
import ApiError from "@/utils/apiError";
import Helper from "@/entity/helper.entity";
import httpStatus from "http-status";

const ClientService = Database.getRepository(Client).extend({
    createClient: async function (user: User, client: IClient) {
        try {
            const newClient = new Client(user, client.height, client.weight);

            return await this.save(newClient);
        } catch (error) {
            throw error;
        }
    },

    getClientByEmail: async function (email: string): Promise<Client> {
        try {
            const client = await this.findOne({ where: { email }, relations: ['user'] });
            if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return client!;
        } catch (error) {
            throw error;
        }
    },

    getClientByID: async function (id: string): Promise<Client> {
        try {
            const client = await this.findOne({ where: { id }, relations: ['user'] });
            if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return client!;
        } catch (error) {
            throw error;
        }
    },

    addHelper: async function (id: string, helper: Helper): Promise<void> {
        try {
            const client: Client = await this.getClientByID(id);
            if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));

            client.addHelper(helper);
            await this.save(client);
        } catch (error) {
            throw error;
        }
    },

    removeHelper: async function (id: string, helper: Helper): Promise<void> {
        try {
            const client: Client = await this.getClientByID(id);
            if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));

            client.removeHelper(helper);
            await this.save(client);
        } catch (error) {
            throw error;
        }
    }


});

export default ClientService;