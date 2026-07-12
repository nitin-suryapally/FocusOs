import { ApiError } from "./ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESOURCE_TYPES = ["article", "video", "course", "book", "tool", "document", "other"];
const RESOURCE_STATUSES = ["saved", "in_progress", "completed", "archived"];

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
