import { asyncHandler } from "../utils/asyncHandler.js";
import { createJobApplication, deleteJobApplication, getJobApplication, listJobApplications, updateJobApplication } from "../services/jobApplicationService.js";
import { validateJobApplicationCreateInput, validateJobApplicationUpdateInput } from "../utils/validation.js";

export const listUserJobApplications = asyncHandler(async (req, res) => res.status(200).json({ applications: await listJobApplications(req.userId) }));
export const createUserJobApplication = asyncHandler(async (req, res) => { validateJobApplicationCreateInput(req.body); res.status(201).json({ message: "Job application created.", application: await createJobApplication(req.userId, req.body) }); });
export const getUserJobApplication = asyncHandler(async (req, res) => res.status(200).json({ application: await getJobApplication(req.userId, req.params.applicationId) }));
export const updateUserJobApplication = asyncHandler(async (req, res) => { validateJobApplicationUpdateInput(req.body); res.status(200).json({ message: "Job application updated.", application: await updateJobApplication(req.userId, req.params.applicationId, req.body) }); });
export const deleteUserJobApplication = asyncHandler(async (req, res) => { await deleteJobApplication(req.userId, req.params.applicationId); res.status(200).json({ message: "Job application deleted." }); });