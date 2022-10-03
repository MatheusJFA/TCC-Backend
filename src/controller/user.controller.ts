import User, { IUser } from "@/entity/user.entity";
import UserService from "@/service/user.service";
import ApiError from "@/utils/apiError";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class UserController {
    createUser = LogAsyncError(async (request: Request, response: Response) => {
            const { name, email, birthdate, sex } = request.body.user;
            const password = getPassword(request.headers!.authorization!);

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            const user = await UserService.createUser({ name, email, birthdate, password, sex, role: "USER", image } as IUser);

            return response
                .status(httpStatus.CREATED)
                .json({ user: user.toJSON() });
    });


    getUser = LogAsyncError(async (request: Request, response: Response) => {
            const id = request.params.id as string;

            let user: User = await UserService.getUserByID(id);

            if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

            return response
                .status(httpStatus.OK)
                .json({ user: user.toJSON() });
    });

    getUsers = LogAsyncError(async (request: Request, response: Response) => {
            const paginate = request.body.pagination;
            const users = await UserService.getUsers(paginate);
            return response
                .status(httpStatus.OK)
                .json(users);
    });


    updateUser = LogAsyncError(async (request: Request, response: Response) => {
       
            const id: string = request.params.id;
            const { name, email, birthdate, sex } = request.body.user;

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            let user: User = await UserService.getUserByID(id);

            if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

            const updatedUser = await UserService.updateUser(id, { name, email, birthdate, sex, image } as IUser)

            return response
                .status(httpStatus.OK)
                .json({ user: updatedUser.toJSON() })
    });

    deleteUser = LogAsyncError(async (request: Request, response: Response) => {
            const id = request.params.id;

            let user: User = await UserService.getUserByID(id);

            if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

            user.invalidate()
            await user.save();
            return response
                .status(httpStatus.OK)
                .json({ message: t("SUCCESS.MESSAGE", { resource: t("RESOURCES.USER"), action: t("ACTION.DELETE") }) });
    });

    changeRole = LogAsyncError(async (request: Request, response: Response) => {
            const id = request.params.id;
            const role = request.body.role;

            let user: User = await UserService.getUserByID(id);

            if (!user) response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });

            user.updateUser({ role });
            return response
                .status(httpStatus.CREATED)
                .json({ message: t("SUCCESS.OK") })
    });

}

export default new UserController();