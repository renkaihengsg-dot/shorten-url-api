import { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";

interface APIError extends Error {
  status?: number | string;
}

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("error middleware: ", err);
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.errors,
    });
  }

  let status = 500;
  if (err && typeof err === "object") {
    const error = err as APIError;
    status =
      typeof error.status === "string"
        ? parseInt(error.status)
        : (error.status ?? 500);
  }

  return res.status(500).json({
    message: (err as Error).message || "Internal Server Error",
    success: false,
  });
};

export default errorHandler;
