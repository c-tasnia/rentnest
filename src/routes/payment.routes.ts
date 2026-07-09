import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPaymentSchema } from "../validations/payment.validation";

const router = Router();

// Public callback/IPN endpoint hit directly by SSLCommerz - no auth possible here.
router.get("/confirm", paymentController.confirmPayment);
router.post("/confirm", paymentController.confirmPayment);

router.post(
  "/create",
  authenticate,
  authorize("TENANT"),
  validate(createPaymentSchema),
  paymentController.createPayment
);
router.get("/", authenticate, paymentController.getMyPayments);
router.get("/:id", authenticate, paymentController.getPaymentById);

export default router;
