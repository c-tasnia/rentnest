import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rentalRequestId: z.string().uuid("rentalRequestId must be a valid id"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});
