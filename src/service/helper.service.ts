import { t } from "i18next";
import ApiError from "@/utils/apiError";
import Database from "@/configuration/database";
import Helper, { IHelper } from "@/entity/helper.entity";
import Client from "@/entity/client.entity";
import Certification from "@/entity/certification.entity";
import { Occupation } from "@/types/occupation.type";
import httpStatus from "http-status";
import { paginate } from "@/helpers/paginate";
import { IPageable } from "@/interfaces/IPageable";
import { IUser } from "@/entity/user.entity";

const HelperService = Database.getRepository(Helper).extend({
    createHelper: async function (name: string, email: string, password: string, birthdate: Date, sex: string, role: string, certifications: Certification[], occupation: string, clients: Client[], image: string) {
        try {
            const newHelper = new Helper(name, email, password, birthdate, sex, role, occupation, image);

            if (certifications) certifications.map(c => newHelper.addCertification(c));

            if (clients) clients.map(c => newHelper.addClient(c));

            await newHelper.hashPassword(password);

            return await this.save(newHelper);
        } catch (error) {
            throw error;
        }
    },

    returnHelperByEmail: async function (email: string): Promise<Helper> {
        try {
            const helper = await this.findOne({ where: { email }, relations: ['tokens', 'certifications'] });
            return helper!;
        } catch (error) {
            throw error;
        }
    },

    getHelperByEmail: async function (email: string): Promise<Helper> {
        try {
            const helper = await this.findOne({ where: { email }, relations: ['tokens', 'certifications'] });
            if (!helper) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return helper!;
        } catch (error) {
            throw error;
        }
    },

    returnHelperByID: async function (id: string): Promise<Helper> {
        try {
            const helper = await this.findOne({ where: { id }, relations: ['tokens', 'certifications'] });
            return helper!;
        } catch (error) {
            throw error;
        }
    },

    getHelperByID: async function (id: string): Promise<Helper> {
        try {
            const helper = await this.findOne({ where: { id }, relations: ['tokens', 'certifications'] });
            if (!helper) throw new ApiError(httpStatus.NOT_FOUND, (t("ERROR.USER.NOT_FOUND")));
            return helper!;
        } catch (error) {
            throw error;
        }
    },

    getHelpers: async function (pagination?: IPageable<Helper>): Promise<{ helpers: Helper[]; total: number; }> {
        try {
            const pageSchema = paginate(pagination)

            const [helpers, total] = await this.findAndCount({
                take: pageSchema.limit,
                skip: ((pageSchema.page - 1) * pageSchema.limit),
                order: {
                    [pageSchema.sort.field]: pageSchema.sort.order
                }
            });

            return { helpers, total };
        } catch (error) {
            throw error;
        }
    },

    updateHelper: async function (id: string, data: IUser): Promise<Helper> {
        try {
            const user: Helper = await this.getHelperByID(id);
            user.updateUser(data);
            return await this.save(user);
        } catch (error) {
            throw error;
        }
    },

    deleteHelper: async function (id: string): Promise<Helper> {
        try {
            const user = await this.getHelperByID(id);
            if (this.invalidUser(user) || !user) throw new ApiError(httpStatus.NOT_FOUND, t("ERROR.USER.NOT_FOUND"));

            user.invalidate();
            return await this.save(user);
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