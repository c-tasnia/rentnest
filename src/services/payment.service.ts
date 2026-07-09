import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { initiateSslcommerzPayment, validateSslcommerzPayment } from "../lib/sslcommerz";

export async function createPaymentSession(tenantId: string, rentalRequestId: string) {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true, tenant: true, payment: true },
  });
  if (!request) throw ApiError.notFound("Rental request not found");
  if (request.tenantId !== tenantId) {
    throw ApiError.forbidden("This rental request does not belong to you");
  }
  if (request.status !== "APPROVED") {
    throw ApiError.badRequest("Only approved rental requests can be paid for");
  }
  if (request.payment) {
    throw ApiError.conflict("A payment already exists for this rental request");
  }

  const transactionId = `RN-${randomUUID()}`;

  const gatewayResponse = await initiateSslcommerzPayment({
    transactionId,
    amount: Number(request.property.price),
    tenantName: request.tenant.name,
    tenantEmail: request.tenant.email,
    tenantPhone: request.tenant.phone ?? undefined,
    propertyTitle: request.property.title,
  });

  if (!gatewayResponse?.GatewayPageURL) {
    throw ApiError.internal("Failed to initiate SSLCommerz payment session");
  }

  const payment = await prisma.payment.create({
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

export async function confirmPayment(tran_id: string, val_id: string | undefined, status: string) {
  const payment = await prisma.payment.findUnique({ where: { transactionId: tran_id } });
  if (!payment) throw ApiError.notFound("Payment record not found");

  if (status !== "success" || !val_id) {
    const failed = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return failed;
  }

  const validation = await validateSslcommerzPayment(val_id);
  const isValid =
    validation?.status === "VALID" || validation?.status === "VALIDATED";

  if (!isValid) {
    return prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  }

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

export async function listPaymentsForUser(tenantId: string) {
  return prisma.payment.findMany({
    where: { tenantId },
    include: { rentalRequest: { include: { property: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaymentById(id: string, tenantId: string, role: string) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { rentalRequest: { include: { property: true } } },
  });
  if (!payment) throw ApiError.notFound("Payment not found");
  if (payment.tenantId !== tenantId && role !== "ADMIN") {
    throw ApiError.forbidden("You cannot view this payment");
  }
  return payment;
}
