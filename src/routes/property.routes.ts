import { Router } from "express";
import * as propertyController from "../controllers/property.controller";
import { validate } from "../middleware/validate";
import { listPropertiesQuerySchema } from "../validations/property.validation";

const router = Router();

router.get("/properties", validate(listPropertiesQuerySchema), propertyController.getProperties);
router.get("/properties/:id", propertyController.getPropertyById);
router.get("/categories", propertyController.getCategories);

export default router;
