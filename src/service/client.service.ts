import { t } from "i18next";
import Database from "@/configuration/database";
import Client, { IClient } from "@/entity/client.entity";
import User from "@/entity/user.entity";
import ApiError from "@/utils/apiError";
import Helper from "@/entity/helper.entity";
import httpStatus from "http-status";

const ClientService = Database.getRepository(Client).extend({
    createClient: async function (user: User, height: number, weight: number, helpers: Helper[]) {
        try {
            const newClient = new Client(user, height, weight);

            if (helpers) helpers.map(h => newClient.addHelper(h));

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

    addHelper: async function (client: Client, helper: Helper): Promise<void> {
        try {
            client.addHelper(helper);
            await this.save(client);
        } catch (error) {
            throw error;
        }
    },

    removeHelper: async function (client: Client, helper: Helper): Promise<void> {
        try {
            client.removeHelper(helper);
            await this.save(client);
        } catch (error) {
            throw error;
        }
    },

    updateClient: async function (client: Client, height, weight): Promise<void> {
        try {
            if (height !== client.height)
                client.height = height;
            if (weight !== client.weight)
                client.weight = weight;

            await this.save(client);
        } catch (error) {
            throw error;
        }
    }
});

export default ClientService;