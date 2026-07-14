import { Task } from "../models/Task.js";
import { ApiError } from "../utils/ApiError.js";

const normalizeTaskPayload = (payload) => {
  const normalized = { ...payload };

  if (normalized.title !== undefined) {
    normalized.title = normalized.title.trim();
  }

  if (normalized.topic !== undefined) {
    normalized.topic = normalized.topic.trim();
  }

  if (normalized.dueDate === "") {
    normalized.dueDate = null;
  }

  return normalized;
};

const findOwnedTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task;
};

export const listTasks = async (userId) => {
  const tasks = await Task.find({ user: userId }).sort({ completed: 1, dueDate: 1, updatedAt: -1 });
  return tasks.map((task) => task.toSafeObject());
};

export const createTask = async (userId, payload) => {
  const task = await Task.create({
    ...normalizeTaskPayload(payload),
    user: userId
  });

  return task.toSafeObject();
};

export const getTask = async (userId, taskId) => {
  const task = await findOwnedTask(taskId, userId);
  return task.toSafeObject();
};

export const updateTask = async (userId, taskId, payload) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    normalizeTaskPayload(payload),
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task.toSafeObject();
};

export const deleteTask = async (userId, taskId) => {
  const task = await findOwnedTask(taskId, userId);
  await task.deleteOne();
};
