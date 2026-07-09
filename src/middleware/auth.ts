import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role, UserStatus } from "@prisma/client";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export interface AuthPayload {
  id: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Authentication token missing");
  }
  const token = header.split(" ")[1];

  let payload: AuthPayload;
  try {
    payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) throw ApiError.unauthorized("User no longer exists");
  if (user.status === UserStatus.BANNED) {
    throw ApiError.forbidden("This account has been banned");
  }

  req.user = { id: user.id, role: user.role };
  next();
});

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
}
