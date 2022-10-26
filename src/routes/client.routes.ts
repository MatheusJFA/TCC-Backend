import ClientController from "@/controller/client.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";

import clientSchema from "@validation/client";

import { minimunRole } from "@/middleware/minimunRole";
import { paginationSchema } from "@/validation/pagination";
import clientController from "@/controller/client.controller";

const router = Router();

router.post("/",
    [validateSchema(clientSchema.createClientSchema)],
    ClientController.createClient);

router.get("/getDietValues/:id",
    clientController.getClientDiet);

router.get("/:id",
    [ validateSchema(clientSchema.getClientSchema)],
    ClientController.getClient);

router.get("/getSexValues", ClientController.getSexValues);

router.get("/",
    [minimunRole("MODERATOR"), validateSchema(paginationSchema)],
    ClientController.getClients);

router.delete("/:id",
    [validateSchema(clientSchema.deleteClientSchema)],
    ClientController.deleteClient);

router.put("/:id",
    [validateSchema(clientSchema.updateClientSchema)],
    ClientController.updateClient);

router.patch("/:id",
    [validateSchema(clientSchema.changeRoleSchema), minimunRole("MODERATOR")],
    ClientController.changeRole);

router.post("/:id",
    [ validateSchema(clientSchema.getClientSchema)],
    ClientController.getClient);

router.post("/add/:id",
    [ validateSchema(clientSchema.addHelperSchema)],
    ClientController.addHelper);

router.put("/:id",
    [validateSchema(clientSchema.updateClientSchema)],
    ClientController.updateClient);


export default router;