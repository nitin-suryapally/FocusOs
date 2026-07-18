import { Router } from "express";
import { getUserStreak } from "../controllers/streakController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const streakRouter = Router();

streakRouter.use(requireAuth);
streakRouter.get("/summary", getUserStreak);