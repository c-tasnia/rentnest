import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export async function createRentalRequest(
  tenantId: string,
  data: { propertyId: string; moveInDate: string; message?: string }
) {
  const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
  if (!property) throw ApiError.notFound("Property not found");
  if (property.status !== "AVAILABLE") {
    throw ApiError.badRequest("This property is not available for rent");
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: data.propertyId,
      moveInDate: new Date(data.moveInDate),
      message: data.message,
    },
  });
}

export async function listRequestsForTenant(tenantId: string) {
  return prisma.rentalRequest.findMany({
    where: { tenantId },
    include: { property: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRentalRequestById(id: string, requesterId: string, role: string) {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true, tenant: { select: { id: true, name: true, email: true } }, payment: true },
  });
  if (!request) throw ApiError.notFound("Rental request not found");

  const isOwner = request.tenantId === requesterId;
  const isLandlord = request.property.landlordId === requesterId;
  if (!isOwner && !isLandlord && role !== "ADMIN") {
    throw ApiError.forbidden("You cannot view this rental request");
  }
  return request;
}

export async function listRequestsForLandlord(landlordId: string) {
  return prisma.rentalRequest.findMany({
    where: { property: { landlordId } },
    include: { property: true, tenant: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateRentalStatus(
  requestId: string,
  landlordId: string,
  status: "APPROVED" | "REJECTED"
) {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });
  if (!request) throw ApiError.notFound("Rental request not found");
  if (request.property.landlordId !== landlordId) {
    throw ApiError.forbidden("You do not manage this property");
  }
  if (request.status !== "PENDING") {
    throw ApiError.badRequest("Only pending requests can be approved or rejected");
  }

  return prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status },
  });
}

export async function markRequestActive(requestId: string) {
  return prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status: "ACTIVE" },
  });
}
