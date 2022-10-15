import HelperController from "@/controller/helper.controller";
import validateSchema from "@/middleware/validateFields";
import { Router } from "express";
import helperSchema from "@validation/helper";
import { validID } from "@/middleware/validID";
import { minimunRole } from "@/middleware/minimunRole";
import { paginationSchema } from "@/validation/pagination";

const router = Router();

router.post("/",
    validateSchema(helperSchema.createHelperSchema),
    HelperController.createHelper);

router.get("/:id",
    validID,
    validateSchema(helperSchema.getHelperSchema),
    HelperController.getHelper);

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