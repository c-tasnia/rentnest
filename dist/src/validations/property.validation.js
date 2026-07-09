"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPropertiesQuerySchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
exports.createPropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().min(10),
        address: zod_1.z.string().min(3),
        city: zod_1.z.string().min(2),
        price: zod_1.z.number().positive("Price must be greater than 0"),
        bedrooms: zod_1.z.number().int().min(0).optional(),
        bathrooms: zod_1.z.number().int().min(0).optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        categoryId: zod_1.z.string().uuid("categoryId must be a valid id"),
    }),
});
exports.updatePropertySchema = zod_1.z.object({
    body: exports.createPropertySchema.shape.body.partial().extend({
        status: zod_1.z.enum(["AVAILABLE", "UNAVAILABLE", "RENTED"]).optional(),
    }),
});
exports.listPropertiesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        city: zod_1.z.string().optional(),
        minPrice: zod_1.z.string().optional(),
        maxPrice: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().optional(),
        bedrooms: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=property.validation.js.map