import { Resource } from "../models/Resource.js";
import { ApiError } from "../utils/ApiError.js";

const normalizeTags = (tags = []) =>
  tags.map((tag) => tag.trim()).filter((tag, index, allTags) => tag && allTags.indexOf(tag) === index);

const normalizeResourcePayload = (payload) => {
  const normalized = { ...payload };

  if (normalized.title !== undefined) {
    normalized.title = normalized.title.trim();
  }

  if (normalized.topic !== undefined) {
    normalized.topic = normalized.topic.trim();
  }

  if (normalized.url !== undefined) {
    normalized.url = normalized.url.trim();
  }

  if (normalized.notes !== undefined) {
    normalized.notes = normalized.notes.trim();
  }

  if (normalized.tags !== undefined) {
    normalized.tags = normalizeTags(normalized.tags);
  }

  return normalized;
};

const findOwnedResource = async (resourceId, userId) => {
  const resource = await Resource.findOne({ _id: resourceId, user: userId });

  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  return resource;
};

export const listResources = async (userId) => {
  const resources = await Resource.find({ user: userId }).sort({ updatedAt: -1 });
  return resources.map((resource) => resource.toSafeObject());
};

export const createResource = async (userId, payload) => {
  const resource = await Resource.create({
    ...normalizeResourcePayload(payload),
    user: userId
  });

  return resource.toSafeObject();
};

export const getResource = async (userId, resourceId) => {
  const resource = await findOwnedResource(resourceId, userId);
  return resource.toSafeObject();
};

export const updateResource = async (userId, resourceId, payload) => {
  const resource = await Resource.findOneAndUpdate(
    { _id: resourceId, user: userId },
    normalizeResourcePayload(payload),
    { new: true, runValidators: true }
  );

  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  return resource.toSafeObject();
};

export const deleteResource = async (userId, resourceId) => {
  const resource = await findOwnedResource(resourceId, userId);
  await resource.deleteOne();
};
