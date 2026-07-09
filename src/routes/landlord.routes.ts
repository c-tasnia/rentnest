import { Router } from "express";
import * as landlordController from "../controllers/landlord.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPropertySchema, updatePropertySchema } from "../validations/property.validation";
import { updateRentalStatusSchema } from "../validations/rental.validation";

const router = Router();

router.use(authenticate, authorize("LANDLORD"));

router.get("/properties", landlordController.getMyProperties);
router.post("/properties", validate(createPropertySchema), landlordController.createProperty);
router.put("/properties/:id", validate(updatePropertySchema), landlordController.updateProperty);
router.delete("/properties/:id", landlordController.deleteProperty);

router.get("/requests", landlordController.getRequestsForMyProperties);
router.patch(
  "/requests/:id",
  validate(updateRentalStatusSchema),
  landlordController.updateRequestStatus
);

export default router;
