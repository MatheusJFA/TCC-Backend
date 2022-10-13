import HelperController from "@/controller/helper.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";

import helperSchema from "@validation/helper";
import { validID } from "@/middleware/validID";

const router = Router();

router.post("/",
    validateSchema(helperSchema.createHelperSchema),
    HelperController.createHelper);

router.get("/:id",
    validID,
    validateSchema(helperSchema.getHelperSchema),
    HelperController.createHelper);

router.post("/client/:id",
    validateSchema(helperSchema.addClient),
    HelperController.addClient);

router.delete("/client/:id",
    validID,
    validateSchema(helperSchema.removeClient),
    HelperController.removeClient);

router.post("/certification/:id",
    validID,
    validateSchema(helperSchema.addCertification),
    HelperController.addCertification);

router.delete("/certification/:id",
    validID,
    validateSchema(helperSchema.removeCertification),
    HelperController.removeCertification);

export default router;