"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProperties = listProperties;
exports.getPropertyById = getPropertyById;
exports.listCategories = listCategories;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
exports.listLandlordProperties = listLandlordProperties;
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
async function listProperties(query) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Number(query.limit) || 10, 50);
    const where = {
        status: "AVAILABLE",
        ...(query.city ? { city: { equals: query.city, mode: "insensitive" } } : {}),
        ...(query.categoryId ? { categoryId: query.categoryId } : {}),
        ...(query.bedrooms ? { bedrooms: { gte: Number(query.bedrooms) } } : {}),
        ...(query.minPrice || query.maxPrice
            ? {
                price: {
                    ...(query.minPrice ? { gte: Number(query.minPrice) } : {}),
                    ...(query.maxPrice ? { lte: Number(query.maxPrice) } : {}),
                },
            }
            : {}),
    };
    const [items, total] = await Promise.all([
        prisma_1.prisma.property.findMany({
            where,
            include: { category: true, landlord: { select: { id: true, name: true } } },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.property.count({ where }),
    ]);
    return {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
async function getPropertyById(id) {
    const property = await prisma_1.prisma.property.findUnique({
        where: { id },
        include: {
            category: true,
            landlord: { select: { id: true, name: true, email: true } },
            reviews: { include: { tenant: { select: { id: true, name: true } } } },
        },
    });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    return property;
}
async function listCategories() {
    return prisma_1.prisma.category.findMany({ orderBy: { name: "asc" } });
}
// Landlord-scoped operations
async function createProperty(landlordId, data) {
    const category = await prisma_1.prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category)
        throw ApiError_1.ApiError.badRequest("Invalid categoryId");
    return prisma_1.prisma.property.create({
        data: { ...data, landlordId },
    });
}
async function assertOwnership(propertyId, landlordId) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    if (property.landlordId !== landlordId) {
        throw ApiError_1.ApiError.forbidden("You do not own this property");
    }
    return property;
}
async function updateProperty(propertyId, landlordId, data) {
    await assertOwnership(propertyId, landlordId);
    return prisma_1.prisma.property.update({ where: { id: propertyId }, data });
}
async function deleteProperty(propertyId, landlordId) {
    await assertOwnership(propertyId, landlordId);
    await prisma_1.prisma.property.delete({ where: { id: propertyId } });
}
async function listLandlordProperties(landlordId) {
    return prisma_1.prisma.property.findMany({
        where: { landlordId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
}
//# sourceMappingURL=property.service.js.map