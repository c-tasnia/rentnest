"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const prisma_1 = require("../lib/prisma");
const catchAsync_1 = require("../utils/catchAsync");
exports.authenticate = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw ApiError_1.ApiError.unauthorized("Authentication token missing");
    }
    const token = header.split(" ")[1];
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
    }
    catch {
        throw ApiError_1.ApiError.unauthorized("Invalid or expired token");
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.id } });
    if (!user)
        throw ApiError_1.ApiError.unauthorized("User no longer exists");
    if (user.status === client_1.UserStatus.BANNED) {
        throw ApiError_1.ApiError.forbidden("This account has been banned");
    }
    req.user = { id: user.id, role: user.role };
    next();
});
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return next(ApiError_1.ApiError.unauthorized());
        if (!roles.includes(req.user.role)) {
            return next(ApiError_1.ApiError.forbidden("You do not have permission to perform this action"));
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map