import { Response } from "express";

export function sendSuccess(
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
  meta: Record<string, unknown> | null = null
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}
