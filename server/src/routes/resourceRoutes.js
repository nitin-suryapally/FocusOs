import { Router } from "express";
import {
  createUserResource,
  deleteUserResource,
  getUserResource,
  listUserResources,
  updateUserResource
} from "../controllers/resourceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const resourceRouter = Router();

resourceRouter.use(requireAuth);
resourceRouter.get("/", listUserResources);
resourceRouter.post("/", createUserResource);
resourceRouter.get("/:resourceId", getUserResource);
resourceRouter.patch("/:resourceId", updateUserResource);
resourceRouter.delete("/:resourceId", deleteUserResource);
