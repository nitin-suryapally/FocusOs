import { JobApplication } from "../models/JobApplication.js";
import { ApiError } from "../utils/ApiError.js";

const normalizeJobApplicationPayload = (payload) => {
  const normalized = { ...payload };
  ["company", "role", "applicationUrl", "notes"].forEach((field) => { if (normalized[field] !== undefined) normalized[field] = normalized[field].trim(); });
  if (normalized.followUpDate === "") normalized.followUpDate = null;
  return normalized;
};

const findOwnedJobApplication = async (applicationId, userId) => {
  const application = await JobApplication.findOne({ _id: applicationId, user: userId });
  if (!application) throw new ApiError(404, "Job application not found.");
  return application;
};

export const listJobApplications = async (userId) => (await JobApplication.find({ user: userId }).sort({ updatedAt: -1 })).map((application) => application.toSafeObject());
export const createJobApplication = async (userId, payload) => (await JobApplication.create({ ...normalizeJobApplicationPayload(payload), user: userId })).toSafeObject();
export const getJobApplication = async (userId, applicationId) => (await findOwnedJobApplication(applicationId, userId)).toSafeObject();
export const updateJobApplication = async (userId, applicationId, payload) => {
  const application = await JobApplication.findOneAndUpdate({ _id: applicationId, user: userId }, normalizeJobApplicationPayload(payload), { new: true, runValidators: true });
  if (!application) throw new ApiError(404, "Job application not found.");
  return application.toSafeObject();
};
export const deleteJobApplication = async (userId, applicationId) => { await (await findOwnedJobApplication(applicationId, userId)).deleteOne(); };