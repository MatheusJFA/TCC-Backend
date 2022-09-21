import HelperController from "@/controller/helper.controller";
import { minimunRole } from "@/middleware/minimunRole";
import { validID } from "@/middleware/validID";
import { Router } from "express";

import helperSchema from "@/validation/helper";
import validateSchema from "@middleware/validateFields";
import { paginationSchema } from "@/validation/pagination"; "@/validation/pagination";

const router = Router();

router.post("/",
    validateSchema(helperSchema.createHelperSchema),
    HelperController.createHelper);

router.post("/:id",
    validID,
    validateSchema(helperSchema.addCertification),
    HelperController.addCertification);

router.post("/:id/:clientId",
    validID,
    validateSchema(helperSchema.addClient),
    HelperController.addClient)

router.get("/:id",
    validID,
    validateSchema(helperSchema.getHelperSchema),
    HelperController.getHelper);

router.get("/:id/clients",
    validID,
    validateSchema(helperSchema.getHelperSchema),
    HelperController.getClientsFromHelper)

router.get("/",
    minimunRole("MODERATOR"),
    validateSchema(paginationSchema),
    HelperController.getHelpers);

router.delete("/:id",
    validateSchema(helperSchema.deleteHelperSchema),
    HelperController.deleteHelper);

router.put("/:id",
    validateSchema(helperSchema.updateHelperSchema),
    HelperController.updateHelper);

router.patch("/:id",
    validateSchema(helperSchema.changeRoleSchema),
    minimunRole("MODERATOR"),
    HelperController.changeRole);

export default router;