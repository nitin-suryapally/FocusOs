import { asyncHandler } from "../utils/asyncHandler.js";
import { addProjectIdeaProgressNote, createProjectIdea, deleteProjectIdea, getProjectIdea, listProjectIdeas, updateProjectIdea } from "../services/projectIdeaService.js";
import { validateProjectIdeaCreateInput, validateProjectIdeaProgressNoteInput, validateProjectIdeaUpdateInput } from "../utils/validation.js";
export const listUserProjectIdeas = asyncHandler(async (req,res)=>res.status(200).json({ ideas: await listProjectIdeas(req.userId) }));
export const createUserProjectIdea = asyncHandler(async (req,res)=>{ validateProjectIdeaCreateInput(req.body); res.status(201).json({ message:"Project idea created.", idea:await createProjectIdea(req.userId,req.body) }); });
export const getUserProjectIdea = asyncHandler(async (req,res)=>res.status(200).json({ idea:await getProjectIdea(req.userId,req.params.ideaId) }));
export const updateUserProjectIdea = asyncHandler(async (req,res)=>{ validateProjectIdeaUpdateInput(req.body); res.status(200).json({ message:"Project idea updated.", idea:await updateProjectIdea(req.userId,req.params.ideaId,req.body) }); });
export const addUserProjectIdeaProgressNote = asyncHandler(async (req,res)=>{ validateProjectIdeaProgressNoteInput(req.body); res.status(201).json({ message:"Progress note added.", idea:await addProjectIdeaProgressNote(req.userId,req.params.ideaId,req.body.text) }); });
export const deleteUserProjectIdea = asyncHandler(async (req,res)=>{ await deleteProjectIdea(req.userId,req.params.ideaId); res.status(200).json({ message:"Project idea deleted." }); });