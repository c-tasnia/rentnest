import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createReviewSchema } from "../validations/review.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("TENANT"),
  validate(createReviewSchema),
  reviewController.createReview
);

export default router;
