import { IHelper } from "@/entity/helper.entity";
import HelperService from "@/service/helper.service";
import { getPassword, validEmail, validPassword } from "@/utils/autenticator";
import { LogAsyncError } from "@/utils/logAsyncError";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { t } from "i18next";

class HelperController {
    createHelper = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const { name, email, birthdate, sex, occupation, certification } = request.body.helper;
            const password = getPassword(request.headers!.authorization!);

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            const helper = await HelperService.createHelper({ name, email, birthdate, password, sex, role: "USER", occupation, image } as IHelper);

            if (certification) helper.addCertification(certification.title, certification.image, certification.date);

            return response
                .status(httpStatus.CREATED)
                .json({ helper: helper.toJSON() });
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });


    getHelper = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id as string;

            let helper: any;

            try {
                helper = await HelperService.getHelperByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }
            return response
                .status(httpStatus.OK)
                .json({ helper: helper.toJSON() });
        } catch (error: any) {

            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    getHelpers = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const paginate = request.body.pagination;
            const helpers = await HelperService.getHelpers(paginate);
            return response
                .status(httpStatus.OK)
                .json(helpers);
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    getClientsFromHelper = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            const clients = await HelperService.getClients(id)
            return clients;
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    addCertification = LogAsyncError(async (request: Request, response: Response) => {

        try {
            const id = request.params.id as string;
            const { title, image, date } = request.body.certification;

            await HelperService.addCertification(id, title, image, date);

            return response.status(httpStatus.OK).send();
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    addClient = LogAsyncError(async (request: Request, response: Response) => {
        try {

            const id = request.params.id as string;
            const clientId = request.body;

            await HelperService.addClient(id, clientId);

            return response.status(httpStatus.OK).send();
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    })

    updateHelper = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id: string = request.params.id;
            const { name, email, birthdate, sex, occupation } = request.body.helper;

            const image = request.file?.filename || "../assets/image/default-avatar.png";

            let helper: any;

            try {
                helper = await HelperService.getHelperByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            const updatedHelper = await HelperService.updateHelper(id, { name, email, birthdate, sex, image, occupation } as IHelper)

            return response
                .status(httpStatus.OK)
                .json({ helper: updatedHelper.toJSON() })
        } catch (error: any) {
            return response
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    });

    deleteHelper = LogAsyncError(async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            let helper: any;

            try {
                helper = await HelperService.getHelperByID(id);
            } catch (error) {
                if (!helper) return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            helper.invalidate()
            await helper.save();
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

            let helper: any;

            try {
                helper = await HelperService.getHelperByID(id);
            } catch (error) {
                return response.status(httpStatus.NOT_FOUND).json({ message: t("ERROR.USER.NOT_FOUND") });
            }

            helper.updateHelper({ role });
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

export default new HelperController();