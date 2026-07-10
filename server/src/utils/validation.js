import { ApiError } from "./ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationInput = (payload) => {
  const { name, email, password } = payload;

  if (!name?.trim()) {
    throw new ApiError(400, "Name is required.");
  }

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "A valid email is required.");
  }

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }
};

export const validateLoginInput = (payload) => {
  const { email, password } = payload;

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "A valid email is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }
};
