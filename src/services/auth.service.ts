import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

function signToken(id: string, role: Role) {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as SignOptions);
}

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: string;
  createdAt: Date;
}) {
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

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict("Email is already registered");

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
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

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  if (user.status === "BANNED") {
    throw ApiError.forbidden("This account has been banned");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const token = signToken(user.id, user.role);
  return { user: toSafeUser(user), token };
}

export async function getCurrentUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("User not found");
  return toSafeUser(user);
}
