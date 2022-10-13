import { t } from "i18next";
import ApiError from "@/utils/apiError";
import Database from "@/configuration/database";
import Helper, { IHelper } from "@/entity/helper.entity";
import User from "@/entity/user.entity";
import Client from "@/entity/client.entity";
import Certification from "@/entity/certification.entity";
import { Occupation } from "@/types/occupation.type";
import httpStatus from "http-status";

const HelperService = Database.getRepository(Helper).extend({
    createHelper: async function (user: User, certifications: Certification[], occupation: Occupation, clients: Client[]) {
        try {
            const newHelper = new Helper(user, occupation);

            if (certifications) certifications.map(c => newHelper.addCertification(c));

            if (clients) clients.map(c => newHelper.addClient(c));

            return await this.save(newHelper);
        } catch (error) {
            throw error;
        }
    },

    getHelperByEmail: async function (email: string): Promise<Helper> {
        try {
            const user = await this.findOne({ where: { email }, relations: ['user'] });
            if (!user || this.invalidHelper(user)) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return user!;
        } catch (error) {
            throw error;
        }
    },

    getHelperByID: async function (id: string): Promise<Helper> {
        try {
            const user = await this.findOne({ where: { id }, relations: ['user'] });
            if (!user || this.invalidHelper(user)) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return user!;
        } catch (error) {
            throw error;
        }
    },

    addClient: async function (helper: Helper, client: Client): Promise<void> {
        try {
            helper.addClient(client);
            await this.save(helper);
        } catch (error) {
            throw error;
        }
    },

    removeClient: async function (helper: Helper, clientId: string): Promise<void> {
        try {
            helper.removeClient(clientId);
            await this.save(helper);
        } catch (error) {
            throw error;
        }
    },

    addCertification: async function (helper: Helper, certification: Certification): Promise<void> {
        try {
            helper.addCertification(certification)
            await this.save(helper);
        } catch (error) {
            throw error;
        }
    },
    
    removeCertification: async function (helper: Helper, certificationId: string): Promise<void> {
        try {
            helper.removeCertification(certificationId)
            await this.save(helper);
        } catch (error) {
            throw error;
        }
    }
});

export default HelperService;