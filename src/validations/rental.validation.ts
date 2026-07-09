import { z } from "zod";

export const createRentalRequestSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid("propertyId must be a valid id"),
    moveInDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "moveInDate must be a valid date",
    }),
    message: z.string().optional(),
  }),
});

export const updateRentalStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
      errorMap: () => ({ message: "Status must be APPROVED or REJECTED" }),
    }),
  }),
});
