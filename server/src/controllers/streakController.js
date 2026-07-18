import { getUserStreakSummary } from "../services/streakService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserStreak = asyncHandler(async (req, res) => {
  const streak = await getUserStreakSummary(req.userId);
  res.status(200).json({ streak });
});