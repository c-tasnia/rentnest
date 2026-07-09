"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
function sendSuccess(res, statusCode, message, data = null, meta = null) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    });
}
//# sourceMappingURL=ApiResponse.js.map