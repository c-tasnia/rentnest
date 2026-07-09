import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export async function createReview(
  tenantId: string,
  data: { rentalRequestId: string; rating: number; comment?: string }
) {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: data.rentalRequestId },
    include: { review: true },
  });
  if (!request) throw ApiError.notFound("Rental request not found");
  if (request.tenantId !== tenantId) {
    throw ApiError.forbidden("You cannot review a rental that is not yours");
  }
  if (request.status !== "ACTIVE" && request.status !== "COMPLETED") {
    throw ApiError.badRequest("You can only review after a rental has started or completed");
  }
  if (request.review) {
    throw ApiError.conflict("You have already reviewed this rental");
  }

  return prisma.review.create({
    data: {
      tenantId,
      propertyId: request.propertyId,
      rentalRequestId: request.id,
      rating: data.rating,
      comment: data.comment,
    },
  });
}
