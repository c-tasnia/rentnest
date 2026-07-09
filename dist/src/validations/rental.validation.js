"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRentalStatusSchema = exports.createRentalRequestSchema = void 0;
const zod_1 = require("zod");
exports.createRentalRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid("propertyId must be a valid id"),
        moveInDate: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: "moveInDate must be a valid date",
        }),
        message: zod_1.z.string().optional(),
    }),
});
exports.updateRentalStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["APPROVED", "REJECTED"], {
            errorMap: () => ({ message: "Status must be APPROVED or REJECTED" }),
        }),
    }),
});
//# sourceMappingURL=rental.validation.js.map