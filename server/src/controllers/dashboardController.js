import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboard } from "../services/dashboardService.js";

export const getUserDashboard = asyncHandler(async (req, res) => {
  res.status(200).json(await getDashboard(req.userId));
});