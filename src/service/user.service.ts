import User, { IUser } from "@/entity/user.entity"
import { t } from "i18next";
import ApiError from "@/utils/apiError";
import { IPageable } from "@/interfaces/IPageable";
import { paginate } from "@/helpers/paginate";
import Database from "@/configuration/database";
import httpStatus from "http-status";

const UserService = Database.getRepository(User).extend({
    invalidUser: (user?: User): boolean => {
        return !user || user.deletedAt !== null;
    },

    userExists: async function (email?: string, id?: string): Promise<boolean> {
        try {
            const user = await this.findOne({ where: [{ email }, { id }] });
            return !!user;
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async function (email: string): Promise<User> {
        try {
            const user = await this.findOne({ where: { email }, relations: ['tokens'] });
            if (!user || this.invalidUser(user)) throw new ApiError(httpStatus.NOT_FOUND, t("ERROR.USER.NOT_FOUND"));
            return user!;
        } catch (error) {
            throw error;
        }
    },

    getUserByID: async function (id: string): Promise<User> {
        try {
            const user = await this.findOne({ where: { id }, relations: ['tokens'] });
            if (!user || this.invalidUser(user)) throw new ApiError(httpStatus.NOT_FOUND, t("ERROR.USER.NOT_FOUND"));
            return user!;
        } catch (error) {
            throw error;
        }
    },


    getUsers: async function (pagination?: IPageable<User>): Promise<{ users: User[]; total: number; }> {
        try {
            const pageSchema = paginate(pagination)

            const [users, total] = await this.findAndCount({
                take: pageSchema.limit,
                skip: ((pageSchema.page - 1) * pageSchema.limit),
                order: {
                    [pageSchema.sort.field]: pageSchema.sort.order
                }
            });

            return { users: users.map((user: User) => user.toJSON()), total };
        } catch (error) {
            throw error;
        }
    },


    updateUser: async function (id: string, data: IUser): Promise<User> {
        try {
            const user: User = await this.getUserByID(id);
            user.updateUser(data);
            return await this.save(user);
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async function (id: string): Promise<User> {
        try {
            const user = await this.getUserByID(id);
            if (this.invalidUser(user) || !user) throw new ApiError(httpStatus.NOT_FOUND, t("ERROR.USER.ALREADY_EXISTS"));

            user.invalidate();
            return await this.save(user);
        } catch (error) {
            throw error;
        }
    },
});

export default UserService;