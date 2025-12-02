/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../ErrorHelpers/AppError";
import { envVars } from "../Config/env";

// --------------------------------------------
// 🌟 Unified Error Formatter
// --------------------------------------------
export const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errors: any[] = [];

  // =============================================================
  // 1️⃣ ZOD VALIDATION ERROR
  // =============================================================
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // =============================================================
  // 2️⃣ MONGODB DUPLICATE KEY
  // =============================================================
  else if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
    errors.push({
      field,
      message,
    });
  }

  // =============================================================
  // 3️⃣ MONGOOSE CAST ERROR (Invalid ObjectId)
  // =============================================================
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    errors.push({
      field: err.path,
      message: "Invalid ObjectId. Please provide a valid ID.",
    });
  }

  // =============================================================
  // 4️⃣ MONGOOSE VALIDATION ERROR
  // =============================================================
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Failed";

    errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // =============================================================
  // 5️⃣ CUSTOM APP ERROR (Your own)
  // =============================================================
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // =============================================================
  // 6️⃣ GENERIC JS ERROR
  // =============================================================
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message || "Internal Server Error";
  }

  // =============================================================
  // 🌟 FINAL RESPONSE
  // =============================================================
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
