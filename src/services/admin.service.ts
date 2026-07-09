import { UserStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export async function listAllUsers() {
  return prisma.user.findMany({
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

export async function updateUserStatus(userId: string, status: UserStatus) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");
  if (user.role === "ADMIN") throw ApiError.badRequest("Cannot change status of an admin account");

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
}

export async function listAllProperties() {
  return prisma.property.findMany({
    include: { landlord: { select: { id: true, name: true, email: true } }, category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllRentalRequests() {
  return prisma.rentalRequest.findMany({
    include: {
      property: { select: { id: true, title: true, city: true } },
      tenant: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCategory(name: string, description?: string) {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) throw ApiError.conflict("Category already exists");
  return prisma.category.create({ data: { name, description } });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw ApiError.notFound("Category not found");
  await prisma.category.delete({ where: { id } });
}
