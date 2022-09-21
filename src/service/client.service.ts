import Client, { IClient } from "@/entity/client.entity"
import { IsNull } from "typeorm";
import { t } from "i18next";
import { IPageable } from "@/interfaces/IPageable";
import { paginate } from "@/helpers/paginate";
import Database from "@/configuration/database";

const ClientService = Database.getRepository(Client).extend({
    invalidClient: (client?: Client): boolean => {
        return !client || client.deletedAt !== null;
    },

    clientExists: async function (email?: string, id?: string): Promise<boolean> {
        try {
            const client = await this.findOne({ where: [{ email }, { id }] });
            return !!client;
        } catch (error) {
            throw error;
        }
    },

    getClient: async function (email: string): Promise<Client> {
        return await this.findOne({ where: { email }, relations: ["tokens"] })
    },

    getClientByEmail: async function (email: string): Promise<Client> {
        try {
            const client = await this.findOne({ where: { email }, relations: ['tokens'] });
            if (!client || this.invalidClient(client)) throw new Error(t("ERROR.USER.NOT_FOUND"));
            return client!;
        } catch (error) {
            throw error;
        }
    },

    getClientByID: async function (id: string): Promise<Client> {
        try {
            const client = await this.findOne({ where: { id }, relations: ['tokens'] });
            if (!client || this.invalidClient(client)) throw new Error(t("ERROR.USER.NOT_FOUND"));
            return client!;
        } catch (error) {
            throw error;
        }
    },


    getClients: async function (pagination?: IPageable<Client>): Promise<{ clients: Client[]; total: number; }> {
        try {
            const pageSchema = paginate(pagination)
            const [clients, total] = await this.findAndCount({
                take: pageSchema.limit,
                skip: ((pageSchema.page - 1) * pageSchema.limit),
                order: {
                    [pageSchema.sort.field]: pageSchema.sort.order
                }
            });

            return { clients: clients.map((client: Client) => client.toJSON()), total };
        } catch (error) {
            throw error;
        }
    },

    createClient: async function (data: IClient): Promise<Client> {
        try {
            const clientExists = await this.clientExists(data.email);

            if (clientExists) throw new Error(t("ERROR.USER.ALREADY_EXISTS"));

            const client = new Client(
                data.name,
                data.email,
                data.password,
                data.birthdate,
                data.sex,
                data.height,
                data.weight,
                data.role,
                data.image);

            await client.hashPassword(data.password);

            return await this.save(client);
        } catch (error) {
            throw error;
        }
    },

    updateClient: async function (id: string, data: IClient): Promise<Client> {
        try {
            const client: Client = await this.getClientByID(id);
            client.updateClient(data);
            return await this.save(client);
        } catch (error) {
            throw error;
        }
    },

    deleteClient: async function (id: string): Promise<Client> {
        try {
            const client = await this.getClientByID(id);
            if (this.invalidClient(client) || !client) throw new Error(t("ERROR.USER.NOT_FOUND"));

            client.invalidate();
            return await this.save(client);
        } catch (error) {
            throw error;
        }
    },
});

export default ClientService;