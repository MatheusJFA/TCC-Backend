import Helper, { IHelper } from "@/entity/helper.entity"
import { t } from "i18next";
import { IPageable } from "@/interfaces/IPageable";
import { paginate } from "@/helpers/paginate";
import Database from "@/configuration/database";

const HelperService = Database.getRepository(Helper).extend({
    invalidHelper: (helper?: Helper): boolean => {
        return !helper || helper.deletedAt !== null;
    },

    helperExists: async function (email?: string, id?: string): Promise<boolean> {
        try {
            const helper = await this.findOne({ where: [{ email }, { id }] });
            return !!helper;
        } catch (error) {
            throw error;
        }
    },

    getHelperByEmail: async function (email: string): Promise<Helper> {
        try {
            const helper = await this.findOne({ where: { email }, relations: ['tokens'] });

            if (!helper || this.invalidHelper(helper)) throw new Error(t("ERROR.USER.NOT_FOUND"));
            return helper!;
        } catch (error) {
            throw error;
        }
    },

    getHelperByID: async function (id: string): Promise<Helper> {
        try {
            const helper = await this.findOne({ where: { id }, relations: ['tokens'] });
            if (!helper || this.invalidHelper(helper)) throw new Error(t("ERROR.USER.NOT_FOUND"));
            return helper!;
        } catch (error) {
            throw error;
        }
    },


    addCertification: async function (id: string, title: string, image: string, date: Date): Promise<void> {
        try {
            const helper = await this.getHelperByID(id);
            if (!helper || this.invalidHelper(helper)) throw new Error(t("ERROR.USER.NOT_FOUND"));

            helper.addCertification(title, image, date);

            return helper;
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

            return { helpers: helpers.map((helper: Helper) => helper.toJSON()), total };
        } catch (error) {
            throw error;
        }
    },

    createHelper: async function (data: IHelper): Promise<Helper> {
        try {
            const helperExists = await this.helperExists(data.email);

            if (helperExists) throw new Error(t("ERROR.USER.ALREADY_EXISTS"));

            const helper = new Helper(
                data.name,
                data.email,
                data.password,
                data.birthdate,
                data.role,
                data.occupation,
                data.sex,
                data.image);

            await helper.hashPassword(data.password);

            return await this.save(helper);
        } catch (error) {
            throw error;
        }
    },

    updateHelper: async function (id: string, data: IHelper): Promise<Helper> {
        try {
            const helper: Helper = await this.getHelperByID(id);
            helper.updateHelper(data);
            return await this.save(helper);
        } catch (error) {
            throw error;
        }
    },

    deleteHelper: async function (id: string): Promise<Helper> {
        try {
            const helper = await this.getHelperByID(id);
            if (this.invalidHelper(helper) || !helper) throw new Error(t("ERROR.USER.NOT_FOUND"));

            helper.invalidate();
            return await this.save(helper);
        } catch (error) {
            throw error;
        }
    },

});

export default HelperService;