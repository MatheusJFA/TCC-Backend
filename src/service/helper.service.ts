import { t } from "i18next";
import Database from "@/configuration/database";
import Helper, { IHelper } from "@/entity/helper.entity";
import User from "@/entity/user.entity";
import Client from "@/entity/client.entity";

const TokenService = Database.getRepository(Helper).extend({
    addHelper: async function (user: User, helper: IHelper) {
        try {
            const newHelper = new Helper(user, helper.occupation);

            if (helper.certifications) helper.certifications.map(c => newHelper.addCertification(c));

            if (helper.clients) helper.clients.map(c => newHelper.addClient(c));

            await this.save(helper);
            return helper;
        } catch (error) {
            throw error;
        }
    },

    getHelperByEmail: async function (email: string): Promise<Helper> {
        try {
            const user = await this.findOne({ where: { email }, relations: ['user'] });
            if (!user || this.invalidHelper(user)) throw new Error(t("ERROR.USER.NOT_FOUND"));
            return user!;
        } catch (error) {
            throw error;
        }
    },

    getHelperByID: async function (id: string): Promise<Helper> {
        try {
            const user = await this.findOne({ where: { id }, relations: ['user'] });
            if (!user || this.invalidHelper(user)) throw new Error(t("ERROR.USER.NOT_FOUND"));
            return user!;
        } catch (error) {
            throw error;
        }
    },

    addClient: async function (helperId: string, client: Client) {
        try {
            const helper = await this.getHelperByID(helperId);

            helper.addClient(client);
        } catch (error) {
            throw error;
        }
    },

    removeClient: async function (helperId: string, client: Client) {
        try {
            const helper = await this.getHelperByID(helperId);

            helper.removeClient(client);
        } catch (error) {
            throw error;
        }
    }
});

export default TokenService;