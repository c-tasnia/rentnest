import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body ?? req.body;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return next(ApiError.badRequest("Validation failed", errorDetails));
      }
      next(err);
    }
  };
}
