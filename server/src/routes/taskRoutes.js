import { Router } from "express";
import {
  createUserTask,
  deleteUserTask,
  getUserTask,
  listUserTasks,
  updateUserTask
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const taskRouter = Router();

taskRouter.use(requireAuth);
taskRouter.get("/", listUserTasks);
taskRouter.post("/", createUserTask);
taskRouter.get("/:taskId", getUserTask);
taskRouter.patch("/:taskId", updateUserTask);
taskRouter.delete("/:taskId", deleteUserTask);
