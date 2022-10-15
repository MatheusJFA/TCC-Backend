import ClientController from "@/controller/client.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";

import clientSchema from "@validation/client";
import { validID } from "@/middleware/validID";
import { minimunRole } from "@/middleware/minimunRole";
import { paginationSchema } from "@/validation/pagination";

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
    validateSchema(paginationSchema),
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

router.post("/:id",
    validID,
    validateSchema(clientSchema.getClientSchema),
    ClientController.getClient);

router.post("/add/:id",
    validID,
    validateSchema(clientSchema.addHelperSchema),
    ClientController.addHelper);

router.put("/:id",
    validateSchema(clientSchema.updateClientSchema),
    ClientController.updateClient);

export default router;