import { Router } from "express";
import { createUserJobApplication, deleteUserJobApplication, getUserJobApplication, listUserJobApplications, updateUserJobApplication } from "../controllers/jobApplicationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const jobApplicationRouter = Router();
jobApplicationRouter.use(requireAuth);
jobApplicationRouter.get("/", listUserJobApplications);
jobApplicationRouter.post("/", createUserJobApplication);
jobApplicationRouter.get("/:applicationId", getUserJobApplication);
jobApplicationRouter.patch("/:applicationId", updateUserJobApplication);
jobApplicationRouter.delete("/:applicationId", deleteUserJobApplication);