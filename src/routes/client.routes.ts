import ClientController from "@/controller/client.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";

import clientSchema from "@validation/client";
import { validID } from "@/middleware/validID";

const router = Router();

router.post("/",
    validateSchema(clientSchema.createClientSchema),
    ClientController.createClient);

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