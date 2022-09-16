import ClientController from "@/controller/client.controller";
import { minimunRole } from "@/middleware/minimunRole";
import { validID } from "@/middleware/validID";
import { Router } from "express";

import clientSchema from "@/validation/client";
import validateSchema from "@middleware/validateFields";

const router = Router();

router.post("/",
    validateSchema(clientSchema.createClientSchema),
    ClientController.createClient);

router.get("/:id",
    validID,
    validateSchema(clientSchema.getClientSchema),
    ClientController.getClient);

router.get("/",
    minimunRole("MODERATOR"),
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

export default router;