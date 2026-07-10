import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const createAuthToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password
  });

  return {
    token: createAuthToken(user._id.toString()),
    user: user.toSafeObject()
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return {
    token: createAuthToken(user._id.toString()),
    user: user.toSafeObject()
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "Authentication required.");
  }

  return user.toSafeObject();
};
