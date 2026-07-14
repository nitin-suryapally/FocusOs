import { asyncHandler } from "../utils/asyncHandler.js";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "../services/taskService.js";
import { validateTaskCreateInput, validateTaskUpdateInput } from "../utils/validation.js";

export const listUserTasks = asyncHandler(async (req, res) => {
  const tasks = await listTasks(req.userId);

  res.status(200).json({
    tasks
  });
});

export const createUserTask = asyncHandler(async (req, res) => {
  validateTaskCreateInput(req.body);
  const task = await createTask(req.userId, req.body);

  res.status(201).json({
    message: "Task created.",
    task
  });
});

export const getUserTask = asyncHandler(async (req, res) => {
  const task = await getTask(req.userId, req.params.taskId);

  res.status(200).json({
    task
  });
});

export const updateUserTask = asyncHandler(async (req, res) => {
  validateTaskUpdateInput(req.body);
  const task = await updateTask(req.userId, req.params.taskId, req.body);

  res.status(200).json({
    message: "Task updated.",
    task
  });
});

export const deleteUserTask = asyncHandler(async (req, res) => {
  await deleteTask(req.userId, req.params.taskId);

  res.status(200).json({
    message: "Task deleted."
  });
});
