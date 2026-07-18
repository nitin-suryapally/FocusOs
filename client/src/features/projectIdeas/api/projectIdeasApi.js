const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
const requestProjectIdeasApi = async (path, token, options, fallbackMessage) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || fallbackMessage);
  return data;
};
export const fetchProjectIdeasRequest = (token) => requestProjectIdeasApi("/api/project-ideas", token, {}, "Unable to load project ideas.");
export const createProjectIdeaRequest = (token, payload) => requestProjectIdeasApi("/api/project-ideas", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }, "Unable to create project idea.");
export const fetchProjectIdeaRequest = (token, ideaId) => requestProjectIdeasApi(`/api/project-ideas/${ideaId}`, token, {}, "Unable to load project idea.");
export const updateProjectIdeaRequest = (token, ideaId, payload) => requestProjectIdeasApi(`/api/project-ideas/${ideaId}`, token, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }, "Unable to update project idea.");
export const addProjectIdeaProgressNoteRequest = (token, ideaId, payload) => requestProjectIdeasApi(`/api/project-ideas/${ideaId}/progress-notes`, token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }, "Unable to add progress note.");
export const deleteProjectIdeaRequest = (token, ideaId) => requestProjectIdeasApi(`/api/project-ideas/${ideaId}`, token, { method: "DELETE" }, "Unable to delete project idea.");
