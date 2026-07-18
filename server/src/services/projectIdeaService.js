import { ProjectIdea } from "../models/ProjectIdea.js";
import { ApiError } from "../utils/ApiError.js";

const normalizeProjectIdeaPayload = (payload) => {
  const normalized = { ...payload };
  ["title", "description", "nextStep"].forEach((field) => { if (normalized[field] !== undefined) normalized[field] = normalized[field].trim(); });
  return normalized;
};

const findOwnedProjectIdea = async (ideaId, userId) => {
  const idea = await ProjectIdea.findOne({ _id: ideaId, user: userId });
  if (!idea) throw new ApiError(404, "Project idea not found.");
  return idea;
};

export const listProjectIdeas = async (userId) => (await ProjectIdea.find({ user: userId }).sort({ updatedAt: -1 })).map((idea) => idea.toSafeObject());
export const createProjectIdea = async (userId, payload) => (await ProjectIdea.create({ ...normalizeProjectIdeaPayload(payload), user: userId })).toSafeObject();
export const getProjectIdea = async (userId, ideaId) => (await findOwnedProjectIdea(ideaId, userId)).toSafeObject();
export const updateProjectIdea = async (userId, ideaId, payload) => {
  const idea = await ProjectIdea.findOneAndUpdate({ _id: ideaId, user: userId }, normalizeProjectIdeaPayload(payload), { new: true, runValidators: true });
  if (!idea) throw new ApiError(404, "Project idea not found.");
  return idea.toSafeObject();
};
export const addProjectIdeaProgressNote = async (userId, ideaId, text) => {
  const idea = await findOwnedProjectIdea(ideaId, userId);
  idea.progressNotes.push({ text: text.trim() });
  await idea.save();
  return idea.toSafeObject();
};
export const deleteProjectIdea = async (userId, ideaId) => { await (await findOwnedProjectIdea(ideaId, userId)).deleteOne(); };