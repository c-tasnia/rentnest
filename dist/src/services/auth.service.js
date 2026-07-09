"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
function signToken(id, role) {
    return jsonwebtoken_1.default.sign({ id, role }, config_1.config.jwtSecret, {
        expiresIn: config_1.config.jwtExpiresIn,
    });
}
function toSafeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
    };
}
async function registerUser(input) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (existing)
        throw ApiError_1.ApiError.conflict("Email is already registered");
    const hashedPassword = await bcryptjs_1.default.hash(input.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            phone: input.phone,
            role: input.role,
        },
    });
    const token = signToken(user.id, user.role);
    return { user: toSafeUser(user), token };
}
async function loginUser(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    if (user.status === "BANNED") {
        throw ApiError_1.ApiError.forbidden("This account has been banned");
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    const token = signToken(user.id, user.role);
    return { user: toSafeUser(user), token };
}
async function getCurrentUser(id) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    return toSafeUser(user);
}
//# sourceMappingURL=auth.service.js.map