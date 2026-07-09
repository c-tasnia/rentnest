"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRentalRequest = createRentalRequest;
exports.listRequestsForTenant = listRequestsForTenant;
exports.getRentalRequestById = getRentalRequestById;
exports.listRequestsForLandlord = listRequestsForLandlord;
exports.updateRentalStatus = updateRentalStatus;
exports.markRequestActive = markRequestActive;
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
async function createRentalRequest(tenantId, data) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id: data.propertyId } });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    if (property.status !== "AVAILABLE") {
        throw ApiError_1.ApiError.badRequest("This property is not available for rent");
    }
    return prisma_1.prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: data.propertyId,
            moveInDate: new Date(data.moveInDate),
            message: data.message,
        },
    });
}
async function listRequestsForTenant(tenantId) {
    return prisma_1.prisma.rentalRequest.findMany({
        where: { tenantId },
        include: { property: true, payment: true },
        orderBy: { createdAt: "desc" },
    });
}
async function getRentalRequestById(id, requesterId, role) {
    const request = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id },
        include: { property: true, tenant: { select: { id: true, name: true, email: true } }, payment: true },
    });
    if (!request)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    const isOwner = request.tenantId === requesterId;
    const isLandlord = request.property.landlordId === requesterId;
    if (!isOwner && !isLandlord && role !== "ADMIN") {
        throw ApiError_1.ApiError.forbidden("You cannot view this rental request");
    }
    return request;
}
async function listRequestsForLandlord(landlordId) {
    return prisma_1.prisma.rentalRequest.findMany({
        where: { property: { landlordId } },
        include: { property: true, tenant: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
    });
}
async function updateRentalStatus(requestId, landlordId, status) {
    const request = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id: requestId },
        include: { property: true },
    });
    if (!request)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    if (request.property.landlordId !== landlordId) {
        throw ApiError_1.ApiError.forbidden("You do not manage this property");
    }
    if (request.status !== "PENDING") {
        throw ApiError_1.ApiError.badRequest("Only pending requests can be approved or rejected");
    }
    return prisma_1.prisma.rentalRequest.update({
        where: { id: requestId },
        data: { status },
    });
}
async function markRequestActive(requestId) {
    return prisma_1.prisma.rentalRequest.update({
        where: { id: requestId },
        data: { status: "ACTIVE" },
    });
}
//# sourceMappingURL=rental.service.js.map