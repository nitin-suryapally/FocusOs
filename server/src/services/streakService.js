import { Task } from "../models/Task.js";
import { calculateStreakSummary } from "../utils/streakRule.js";

export const getUserStreakSummary = async (userId, now = new Date()) => {
  const tasks = await Task.find({
    user: userId,
    completed: true,
    completedAt: { $ne: null }
  }).select("completedAt");

  return calculateStreakSummary(tasks.map((task) => task.completedAt), now);
};