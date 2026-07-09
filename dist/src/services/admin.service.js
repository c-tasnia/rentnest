"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllUsers = listAllUsers;
exports.updateUserStatus = updateUserStatus;
exports.listAllProperties = listAllProperties;
exports.listAllRentalRequests = listAllRentalRequests;
exports.createCategory = createCategory;
exports.deleteCategory = deleteCategory;
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
async function listAllUsers() {
    return prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
}
async function updateUserStatus(userId, status) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    if (user.role === "ADMIN")
        throw ApiError_1.ApiError.badRequest("Cannot change status of an admin account");
    return prisma_1.prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
}
async function listAllProperties() {
    return prisma_1.prisma.property.findMany({
        include: { landlord: { select: { id: true, name: true, email: true } }, category: true },
        orderBy: { createdAt: "desc" },
    });
}
async function listAllRentalRequests() {
    return prisma_1.prisma.rentalRequest.findMany({
        include: {
            property: { select: { id: true, title: true, city: true } },
            tenant: { select: { id: true, name: true, email: true } },
            payment: true,
        },
        orderBy: { createdAt: "desc" },
    });
}
async function createCategory(name, description) {
    const existing = await prisma_1.prisma.category.findUnique({ where: { name } });
    if (existing)
        throw ApiError_1.ApiError.conflict("Category already exists");
    return prisma_1.prisma.category.create({ data: { name, description } });
}
async function deleteCategory(id) {
    const category = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!category)
        throw ApiError_1.ApiError.notFound("Category not found");
    await prisma_1.prisma.category.delete({ where: { id } });
}
//# sourceMappingURL=admin.service.js.map