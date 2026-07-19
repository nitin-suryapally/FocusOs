import { Router } from "express";
import { getUserDashboard } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/", getUserDashboard);