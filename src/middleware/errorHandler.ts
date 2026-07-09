import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Known, intentional API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorDetails: err.errorDetails ?? null,
    });
  }

  // Prisma known request errors (unique constraint, not found, FK violation, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field(s): ${(err.meta?.target as string[])?.join(", ")}`,
        errorDetails: err.meta ?? null,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Requested resource does not exist",
        errorDetails: err.meta ?? null,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Database request error",
      errorDetails: { code: err.code, meta: err.meta },
    });
  }

  // Fallback: unexpected/unhandled errors
  const message = err instanceof Error ? err.message : "Something went wrong";
  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errorDetails: process.env.NODE_ENV === "development" ? message : null,
  });
}
