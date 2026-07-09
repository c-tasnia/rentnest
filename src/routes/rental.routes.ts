import { Router } from "express";
import * as rentalController from "../controllers/rental.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createRentalRequestSchema } from "../validations/rental.validation";

const router = Router();

router.use(authenticate, authorize("TENANT"));

router.post("/", validate(createRentalRequestSchema), rentalController.createRentalRequest);
router.get("/", rentalController.getMyRentalRequests);
router.get("/:id", rentalController.getRentalRequestById);

export default router;
