"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        rentalRequestId: zod_1.z.string().uuid("rentalRequestId must be a valid id"),
    }),
});
//# sourceMappingURL=payment.validation.js.map