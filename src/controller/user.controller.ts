import User, { IUser } from "@/entity/user.entity";
import UserService from "@/service/user.service";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class UserController {
    createUser = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const { name, email, birthdate, sex } = request.body.user;
            const password = getPassword(request.headers!.authorization!);

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            const user = await UserService.createUser({ name, email, birthdate, password, sex, role: "USER", image } as IUser);

            return response
                .status(httpStatus.CREATED)
                .json({ user: user.toJSON() });
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });


    getUser = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id as string;
            let user: any;

            try {
                user = await UserService.getUserByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            return response
                .status(httpStatus.OK)
                .json({ user: user.toJSON() });
        } catch (error: any) {

            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    getUsers = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const paginate = request.body.pagination;
            const users = await UserService.getUsers(paginate);
            return response
                .status(httpStatus.OK)
                .json(users);
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });


    updateUser = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id: string = request.params.id;
            const { name, email, birthdate, sex } = request.body.user;

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            let user: any;

            try {
                user = await UserService.getUserByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            const updatedUser = await UserService.updateUser(id, { name, email, birthdate, sex, image } as IUser)

            return response
                .status(httpStatus.OK)
                .json({ user: updatedUser.toJSON() })
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    deleteUser = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            let user: any;

            try {
                user = await UserService.getUserByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            user.invalidate()
            await user.save();
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

            let user: any;

            try {
                user = await UserService.getUserByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            user.updateUser({ role });
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

export default new UserController();