"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
function validate(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body ?? req.body;
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const errorDetails = err.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));
                return next(ApiError_1.ApiError.badRequest("Validation failed", errorDetails));
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map