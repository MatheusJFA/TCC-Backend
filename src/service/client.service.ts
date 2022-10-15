import { t } from "i18next";
import Database from "@/configuration/database";
import Client from "@/entity/client.entity";
import User, { IUser } from "@/entity/user.entity";
import ApiError from "@/utils/apiError";
import Helper from "@/entity/helper.entity";
import httpStatus from "http-status";
import { paginate } from "@/helpers/paginate";
import { IPageable } from "@/interfaces/IPageable";

const ClientService = Database.getRepository(Client).extend({
    createClient: async function (name: string, email: string, password: string, birthdate: Date, sex: string, role: string, height: number, weight: number, helpers: Helper[], images: string) {
        try {
            const newClient = new Client(name, email, password, birthdate, sex, role, height, weight, images);

            if (helpers) helpers.map(h => newClient.addHelper(h));
            
            await newClient.hashPassword(password);

            return await this.save(newClient);
        } catch (error) {
            throw error;
        }
    },

    getClientByEmail: async function (email: string): Promise<Client> {
        try {
            const client = await this.findOne({ where: { email }, relations: ['tokens'] });
            if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return client!;
        } catch (error) {
            throw error;
        }
    },

    getClientByID: async function (id: string): Promise<Client> {
        try {
            const client = await this.findOne({ where: { id }, relations: ['tokens'] });
            if (!client) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
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

            return { clients, total };
        } catch (error) {
            throw error;
        }
    },

    updateClient: async function (id: string, data: IUser, height: number, weight: number): Promise<Helper> {
        try {
            const user: Client = await this.getClientByID(id);
            user.updateUser(data);
            user.updateHeightAndWeight(height, weight);
            return await this.save(user);
        } catch (error) {
            throw error;
        }
    },

    deleteClient: async function (id: string): Promise<Helper> {
        try {
            const user = await this.getClientByID(id);
            if (this.invalidUser(user) || !user) throw new ApiError(httpStatus.NOT_FOUND, t("ERROR.USER.ALREADY_EXISTS"));

            user.invalidate();
            return await this.save(user);
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
});

export default ClientService;