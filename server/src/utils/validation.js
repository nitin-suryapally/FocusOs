import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESOURCE_TYPES = ["article", "video", "course", "book", "tool", "document", "other"];
const RESOURCE_STATUSES = ["saved", "in_progress", "completed", "archived"];
const TASK_TYPES = ["general", "learning"];
const TASK_PRIORITIES = ["low", "medium", "high"];
const PROJECT_IDEA_STATUSES = ["idea", "planned", "in_progress", "completed", "archived"];
const JOB_APPLICATION_STATUSES = ["saved", "applied", "interviewing", "offer", "rejected", "withdrawn"];

const isValidDateValue = (value) => !Number.isNaN(new Date(value).getTime());

export const validateRegistrationInput = (payload) => {
  const { name, email, password } = payload;

  if (!name?.trim()) {
    throw new ApiError(400, "Name is required.");
  }

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "A valid email is required.");
  }

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }
};

export const validateLoginInput = (payload) => {
  const { email, password } = payload;

  if (!email?.trim() || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "A valid email is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }
};

const assertResourceFields = (payload, { requireCoreFields }) => {
  const { title, topic, type, status, url, tags, notes } = payload;

  if (requireCoreFields && !title?.trim()) {
    throw new ApiError(400, "Title is required.");
  }

  if (requireCoreFields && !topic?.trim()) {
    throw new ApiError(400, "Topic is required.");
  }

  if (title !== undefined && !title?.trim()) {
    throw new ApiError(400, "Title is required.");
  }

  if (topic !== undefined && !topic?.trim()) {
    throw new ApiError(400, "Topic is required.");
  }

  if (type !== undefined && !RESOURCE_TYPES.includes(type)) {
    throw new ApiError(400, "Resource type is invalid.");
  }

  if (status !== undefined && !RESOURCE_STATUSES.includes(status)) {
    throw new ApiError(400, "Resource status is invalid.");
  }

  if (url !== undefined && url?.trim()) {
    try {
      new URL(url);
    } catch {
      throw new ApiError(400, "Resource URL is invalid.");
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    throw new ApiError(400, "Tags must be an array.");
  }

  if (tags?.some((tag) => typeof tag !== "string")) {
    throw new ApiError(400, "Tags must contain only strings.");
  }

  if (notes !== undefined && typeof notes !== "string") {
    throw new ApiError(400, "Notes must be text.");
  }
};

export const validateResourceCreateInput = (payload) => {
  assertResourceFields(payload, { requireCoreFields: true });
};

export const validateResourceUpdateInput = (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, "At least one resource field is required.");
  }

  assertResourceFields(payload, { requireCoreFields: false });
};

const assertTaskFields = (payload, { requireTitle }) => {
  const { title, type, priority, dueDate, completed, topic, resourceId } = payload;

  if (requireTitle && !title?.trim()) {
    throw new ApiError(400, "Title is required.");
  }

  if (title !== undefined && !title?.trim()) {
    throw new ApiError(400, "Title is required.");
  }

  if (type !== undefined && !TASK_TYPES.includes(type)) {
    throw new ApiError(400, "Task type is invalid.");
  }

  if (priority !== undefined && !TASK_PRIORITIES.includes(priority)) {
    throw new ApiError(400, "Task priority is invalid.");
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== "" && !isValidDateValue(dueDate)) {
    throw new ApiError(400, "Task due date is invalid.");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    throw new ApiError(400, "Completed must be true or false.");
  }

  if (topic !== undefined && typeof topic !== "string") {
    throw new ApiError(400, "Topic must be text.");
  }

  if (topic !== undefined && topic !== "" && !topic.trim()) {
    throw new ApiError(400, "Topic must be text.");
  }

  if (resourceId !== undefined && resourceId !== null && resourceId !== "" && !mongoose.isValidObjectId(resourceId)) {
    throw new ApiError(400, "Linked resource is invalid.");
  }
};

export const validateTaskCreateInput = (payload) => {
  assertTaskFields(payload, { requireTitle: true });
};

export const validateTaskUpdateInput = (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, "At least one task field is required.");
  }

  assertTaskFields(payload, { requireTitle: false });
};

const assertProjectIdeaFields = (payload, { requireTitle }) => {
  const { title, description, status, nextStep } = payload;
  if (requireTitle && !title?.trim()) throw new ApiError(400, "Title is required.");
  if (title !== undefined && !title?.trim()) throw new ApiError(400, "Title is required.");
  if (description !== undefined && typeof description !== "string") throw new ApiError(400, "Description must be text.");
  if (nextStep !== undefined && typeof nextStep !== "string") throw new ApiError(400, "Next step must be text.");
  if (status !== undefined && !PROJECT_IDEA_STATUSES.includes(status)) throw new ApiError(400, "Project idea status is invalid.");
};
export const validateProjectIdeaCreateInput = (payload) => assertProjectIdeaFields(payload, { requireTitle: true });
export const validateProjectIdeaUpdateInput = (payload) => { if (!payload || Object.keys(payload).length === 0) throw new ApiError(400, "At least one project idea field is required."); assertProjectIdeaFields(payload, { requireTitle: false }); };
export const validateProjectIdeaProgressNoteInput = (payload) => { if (!payload?.text || typeof payload.text !== "string" || !payload.text.trim()) throw new ApiError(400, "Progress note text is required."); };
const assertJobApplicationFields = (payload, { requireCoreFields }) => {
  const { company, role, status, applicationUrl, followUpDate, notes } = payload;
  if (requireCoreFields && !company?.trim()) throw new ApiError(400, "Company is required.");
  if (requireCoreFields && !role?.trim()) throw new ApiError(400, "Role is required.");
  if (company !== undefined && !company?.trim()) throw new ApiError(400, "Company is required.");
  if (role !== undefined && !role?.trim()) throw new ApiError(400, "Role is required.");
  if (status !== undefined && !JOB_APPLICATION_STATUSES.includes(status)) throw new ApiError(400, "Job application status is invalid.");
  if (applicationUrl !== undefined && applicationUrl?.trim()) { try { new URL(applicationUrl); } catch { throw new ApiError(400, "Application URL is invalid."); } }
  if (followUpDate !== undefined && followUpDate !== null && followUpDate !== "" && !isValidDateValue(followUpDate)) throw new ApiError(400, "Follow-up date is invalid.");
  if (notes !== undefined && typeof notes !== "string") throw new ApiError(400, "Notes must be text.");
};
export const validateJobApplicationCreateInput = (payload) => assertJobApplicationFields(payload, { requireCoreFields: true });
export const validateJobApplicationUpdateInput = (payload) => { if (!payload || Object.keys(payload).length === 0) throw new ApiError(400, "At least one job application field is required."); assertJobApplicationFields(payload, { requireCoreFields: false }); };