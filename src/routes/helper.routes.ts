import HelperController from "@/controller/helper.controller";
import { minimunRole } from "@/middleware/minimunRole";
import { validID } from "@/middleware/validID";
import { Router } from "express";

import helperSchema from "@/validation/helper";
import validateSchema from "@middleware/validateFields";

const router = Router();

router.post("/",
    validateSchema(helperSchema.createHelperSchema),
    HelperController.createHelper);

router.post("/:id",
    validID,
    validateSchema(helperSchema.addCertification),
    HelperController.addCertification);

router.get("/:id",
    validID,
    validateSchema(helperSchema.getHelperSchema),
    HelperController.getHelper);

router.get("/",
    minimunRole("MODERATOR"),
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