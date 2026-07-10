import { asyncHandler } from "../utils/asyncHandler.js";
import { validateLoginInput, validateRegistrationInput } from "../utils/validation.js";
import { getUserById, loginUser, registerUser } from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  validateRegistrationInput(req.body);
  const result = await registerUser(req.body);

  res.status(201).json({
    message: "Registration successful.",
    ...result
  });
});

export const login = asyncHandler(async (req, res) => {
  validateLoginInput(req.body);
  const result = await loginUser(req.body);

  res.status(200).json({
    message: "Login successful.",
    ...result
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: "Logout successful."
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.userId);

  res.status(200).json({
    user
  });
});
