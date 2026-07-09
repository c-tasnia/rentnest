"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getMyPayments = exports.confirmPayment = exports.createPayment = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const paymentService = __importStar(require("../services/payment.service"));
const config_1 = require("../config");
exports.createPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const { rentalRequestId } = req.body;
    const result = await paymentService.createPaymentSession(req.user.id, rentalRequestId);
    (0, ApiResponse_1.sendSuccess)(res, 201, "Payment session created", result);
});
// SSLCommerz redirects/IPN hit this endpoint (POST, form-encoded) after checkout.
exports.confirmPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const status = req.query.status || req.body.status;
    const tran_id = req.body.tran_id || req.query.tran_id;
    const val_id = req.body.val_id || req.query.val_id;
    if (!tran_id)
        throw ApiError_1.ApiError.badRequest("Missing tran_id in payment callback");
    const payment = await paymentService.confirmPayment(tran_id, val_id, status);
    // Redirect the tenant's browser back to the frontend with the result.
    const redirectUrl = `${config_1.config.frontendUrl}/payment-result?status=${payment.status.toLowerCase()}&tranId=${payment.transactionId}`;
    if (req.method === "GET") {
        return res.redirect(redirectUrl);
    }
    (0, ApiResponse_1.sendSuccess)(res, 200, "Payment status updated", payment);
});
exports.getMyPayments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const payments = await paymentService.listPaymentsForUser(req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Payment history fetched", payments);
});
exports.getPaymentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const payment = await paymentService.getPaymentById(req.params.id, req.user.id, req.user.role);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Payment fetched", payment);
});
//# sourceMappingURL=payment.controller.js.map