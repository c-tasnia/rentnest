import { z } from "zod";

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    address: z.string().min(3),
    city: z.string().min(2),
    price: z.number().positive("Price must be greater than 0"),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string().url()).optional(),
    categoryId: z.string().uuid("categoryId must be a valid id"),
  }),
});

export const updatePropertySchema = z.object({
  body: createPropertySchema.shape.body.partial().extend({
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "RENTED"]).optional(),
  }),
});

export const listPropertiesQuerySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    categoryId: z.string().optional(),
    bedrooms: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
