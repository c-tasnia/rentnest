"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
async function createReview(tenantId, data) {
    const request = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id: data.rentalRequestId },
        include: { review: true },
    });
    if (!request)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    if (request.tenantId !== tenantId) {
        throw ApiError_1.ApiError.forbidden("You cannot review a rental that is not yours");
    }
    if (request.status !== "ACTIVE" && request.status !== "COMPLETED") {
        throw ApiError_1.ApiError.badRequest("You can only review after a rental has started or completed");
    }
    if (request.review) {
        throw ApiError_1.ApiError.conflict("You have already reviewed this rental");
    }
    return prisma_1.prisma.review.create({
        data: {
            tenantId,
            propertyId: request.propertyId,
            rentalRequestId: request.id,
            rating: data.rating,
            comment: data.comment,
        },
    });
}
//# sourceMappingURL=review.service.js.map