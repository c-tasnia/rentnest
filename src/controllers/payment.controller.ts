import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as paymentService from "../services/payment.service";
import { config } from "../config";

export const createPayment = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const { rentalRequestId } = req.body;
  const result = await paymentService.createPaymentSession(req.user.id, rentalRequestId);
  sendSuccess(res, 201, "Payment session created", result);
});

// SSLCommerz redirects/IPN hit this endpoint (POST, form-encoded) after checkout.
export const confirmPayment = catchAsync(async (req, res) => {
  const status = (req.query.status as string) || req.body.status;
  const tran_id = req.body.tran_id || req.query.tran_id;
  const val_id = req.body.val_id || req.query.val_id;

  if (!tran_id) throw ApiError.badRequest("Missing tran_id in payment callback");

  const payment = await paymentService.confirmPayment(tran_id, val_id, status);

  // Redirect the tenant's browser back to the frontend with the result.
  const redirectUrl = `${config.frontendUrl}/payment-result?status=${payment.status.toLowerCase()}&tranId=${payment.transactionId}`;
  if (req.method === "GET") {
    return res.redirect(redirectUrl);
  }
  sendSuccess(res, 200, "Payment status updated", payment);
});

export const getMyPayments = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const payments = await paymentService.listPaymentsForUser(req.user.id);
  sendSuccess(res, 200, "Payment history fetched", payments);
});

export const getPaymentById = catchAsync(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized();
  const payment = await paymentService.getPaymentById(req.params.id, req.user.id, req.user.role);
  sendSuccess(res, 200, "Payment fetched", payment);
});
