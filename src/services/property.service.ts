import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

interface ListQuery {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  bedrooms?: string;
  page?: string;
  limit?: string;
}

export async function listProperties(query: ListQuery) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, 50);

  const where: Prisma.PropertyWhereInput = {
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
    prisma.property.findMany({
      where,
      include: { category: true, landlord: { select: { id: true, name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getPropertyById(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, email: true } },
      reviews: { include: { tenant: { select: { id: true, name: true } } } },
    },
  });
  if (!property) throw ApiError.notFound("Property not found");
  return property;
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

// Landlord-scoped operations

export async function createProperty(landlordId: string, data: Prisma.PropertyUncheckedCreateInput) {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw ApiError.badRequest("Invalid categoryId");

  return prisma.property.create({
    data: { ...data, landlordId },
  });
}

async function assertOwnership(propertyId: string, landlordId: string) {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw ApiError.notFound("Property not found");
  if (property.landlordId !== landlordId) {
    throw ApiError.forbidden("You do not own this property");
  }
  return property;
}

export async function updateProperty(
  propertyId: string,
  landlordId: string,
  data: Prisma.PropertyUpdateInput
) {
  await assertOwnership(propertyId, landlordId);
  return prisma.property.update({ where: { id: propertyId }, data });
}

export async function deleteProperty(propertyId: string, landlordId: string) {
  await assertOwnership(propertyId, landlordId);
  await prisma.property.delete({ where: { id: propertyId } });
}

export async function listLandlordProperties(landlordId: string) {
  return prisma.property.findMany({
    where: { landlordId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}
