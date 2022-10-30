import ClientController from "@/controller/client.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";

import clientSchema from "@validation/client";
import utilsSchema from "@validation/utils";

import { minimunRole } from "@/middleware/minimunRole";
import { paginationSchema } from "@/validation/pagination";
import clientController from "@/controller/client.controller";

const router = Router();

router.post("/",
    validateSchema(clientSchema.createClientSchema),
    ClientController.createClient);

router.get("/getDietValues/:id",
    validateSchema(utilsSchema.validID),
    clientController.getClientDiet);

router.get("/:id",
    validateSchema(clientSchema.getClientSchema),
    ClientController.getClient);

router.get("/",
    minimunRole("MODERATOR"), validateSchema(paginationSchema),
    ClientController.getClients);

router.delete("/:id",
    validateSchema(clientSchema.deleteClientSchema),
    ClientController.deleteClient);

router.put("/:id",
    validateSchema(clientSchema.updateClientSchema),
    ClientController.updateClient);

router.patch("/:id",
    validateSchema(clientSchema.changeRoleSchema),
    minimunRole("MODERATOR"),
    ClientController.changeRole);

router.post("/add/:id",
    validateSchema(clientSchema.addOrRemoveHelperSchema),
    ClientController.addHelper);

router.post("/remove/:id",
    validateSchema(clientSchema.addOrRemoveHelperSchema),
    ClientController.removeHelper);

export default router;