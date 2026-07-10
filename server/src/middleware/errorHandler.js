import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (_req, _res, next) => {
  next(new ApiError(404, "Route not found."));
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details || null
    });
  }

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed.",
      details: Object.values(error.errors).map((entry) => entry.message)
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      message: "An account with this email already exists.",
      details: null
    });
  }

  return res.status(500).json({
    message: "Internal server error.",
    details: null
  });
};
