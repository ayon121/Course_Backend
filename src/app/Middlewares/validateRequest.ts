import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.errors.map((err) => ({
            path: err.path[0],
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
