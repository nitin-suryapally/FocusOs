import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource
} from "../services/resourceService.js";
import { validateResourceCreateInput, validateResourceUpdateInput } from "../utils/validation.js";

export const listUserResources = asyncHandler(async (req, res) => {
  const resources = await listResources(req.userId);

  res.status(200).json({
    resources
  });
});

export const createUserResource = asyncHandler(async (req, res) => {
  validateResourceCreateInput(req.body);
  const resource = await createResource(req.userId, req.body);

  res.status(201).json({
    message: "Resource created.",
    resource
  });
});

export const getUserResource = asyncHandler(async (req, res) => {
  const resource = await getResource(req.userId, req.params.resourceId);

  res.status(200).json({
    resource
  });
});

export const updateUserResource = asyncHandler(async (req, res) => {
  validateResourceUpdateInput(req.body);
  const resource = await updateResource(req.userId, req.params.resourceId, req.body);

  res.status(200).json({
    message: "Resource updated.",
    resource
  });
});

export const deleteUserResource = asyncHandler(async (req, res) => {
  await deleteResource(req.userId, req.params.resourceId);

  res.status(200).json({
    message: "Resource deleted."
  });
});
