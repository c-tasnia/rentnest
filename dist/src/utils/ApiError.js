"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, errorDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, errorDetails) {
        return new ApiError(400, message, errorDetails);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }
    static conflict(message, errorDetails) {
        return new ApiError(409, message, errorDetails);
    }
    static internal(message = "Internal server error", errorDetails) {
        return new ApiError(500, message, errorDetails);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map