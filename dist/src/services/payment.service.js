"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSession = createPaymentSession;
exports.confirmPayment = confirmPayment;
exports.listPaymentsForUser = listPaymentsForUser;
exports.getPaymentById = getPaymentById;
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
const sslcommerz_1 = require("../lib/sslcommerz");
async function createPaymentSession(tenantId, rentalRequestId) {
    const request = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id: rentalRequestId },
        include: { property: true, tenant: true, payment: true },
    });
    if (!request)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    if (request.tenantId !== tenantId) {
        throw ApiError_1.ApiError.forbidden("This rental request does not belong to you");
    }
    if (request.status !== "APPROVED") {
        throw ApiError_1.ApiError.badRequest("Only approved rental requests can be paid for");
    }
    if (request.payment) {
        throw ApiError_1.ApiError.conflict("A payment already exists for this rental request");
    }
    const transactionId = `RN-${(0, crypto_1.randomUUID)()}`;
    const gatewayResponse = await (0, sslcommerz_1.initiateSslcommerzPayment)({
        transactionId,
        amount: Number(request.property.price),
        tenantName: request.tenant.name,
        tenantEmail: request.tenant.email,
        tenantPhone: request.tenant.phone ?? undefined,
        propertyTitle: request.property.title,
    });
    if (!gatewayResponse?.GatewayPageURL) {
        throw ApiError_1.ApiError.internal("Failed to initiate SSLCommerz payment session");
    }
    const payment = await prisma_1.prisma.payment.create({
        data: {
            transactionId,
            amount: request.property.price,
            method: "SSLCommerz",
            provider: "SSLCOMMERZ",
            status: "PENDING",
            rentalRequestId: request.id,
            tenantId,
        },
    });
    return { payment, gatewayUrl: gatewayResponse.GatewayPageURL };
}
async function confirmPayment(tran_id, val_id, status) {
    const payment = await prisma_1.prisma.payment.findUnique({ where: { transactionId: tran_id } });
    if (!payment)
        throw ApiError_1.ApiError.notFound("Payment record not found");
    if (status !== "success" || !val_id) {
        const failed = await prisma_1.prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
        });
        return failed;
    }
    const validation = await (0, sslcommerz_1.validateSslcommerzPayment)(val_id);
    const isValid = validation?.status === "VALID" || validation?.status === "VALIDATED";
    if (!isValid) {
        return prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    }
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
        const paid = await tx.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED", paidAt: new Date() },
        });
        const rental = await tx.rentalRequest.update({
            where: { id: payment.rentalRequestId },
            data: { status: "ACTIVE" },
            include: { property: true },
        });
        await tx.property.update({
            where: { id: rental.propertyId },
            data: { status: "RENTED" },
        });
        return paid;
    });
    return updated;
}
async function listPaymentsForUser(tenantId) {
    return prisma_1.prisma.payment.findMany({
        where: { tenantId },
        include: { rentalRequest: { include: { property: true } } },
        orderBy: { createdAt: "desc" },
    });
}
async function getPaymentById(id, tenantId, role) {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: { id },
        include: { rentalRequest: { include: { property: true } } },
    });
    if (!payment)
        throw ApiError_1.ApiError.notFound("Payment not found");
    if (payment.tenantId !== tenantId && role !== "ADMIN") {
        throw ApiError_1.ApiError.forbidden("You cannot view this payment");
    }
    return payment;
}
//# sourceMappingURL=payment.service.js.map