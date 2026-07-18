import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectIdeaDetailPage } from "../../features/projectIdeas/pages/ProjectIdeaDetailPage";

const fetchProjectIdeaRequestMock = vi.fn();
const addProjectIdeaProgressNoteRequestMock = vi.fn();
const deleteProjectIdeaRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();

vi.mock("../../features/projectIdeas/api/projectIdeasApi", () => ({
  fetchProjectIdeaRequest: (...args) => fetchProjectIdeaRequestMock(...args),
  addProjectIdeaProgressNoteRequest: (...args) => addProjectIdeaProgressNoteRequestMock(...args),
  deleteProjectIdeaRequest: (...args) => deleteProjectIdeaRequestMock(...args)
}));
vi.mock("../../store/useAuthStore", () => ({ useAuthToken: () => useAuthTokenMock() }));

const idea = { id: "idea-1", title: "Focus timer", description: "A focused timer.", status: "planned", nextStep: "Test the prototype", progressNotes: [] };
const renderPage = () => render(<MemoryRouter initialEntries={["/app/projects/idea-1"]}><Routes><Route path="/app/projects" element={<p>Project ideas list</p>} /><Route path="/app/projects/:ideaId" element={<ProjectIdeaDetailPage />} /></Routes></MemoryRouter>);

describe("ProjectIdeaDetailPage", () => {
  beforeEach(() => { vi.clearAllMocks(); useAuthTokenMock.mockReturnValue("token-123"); fetchProjectIdeaRequestMock.mockResolvedValue({ idea }); });

  it("loads a detail view with an empty progress history", async () => {
    renderPage();
    expect(screen.getByLabelText(/project idea loading state/i)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /focus timer/i })).toBeInTheDocument();
    expect(screen.getByText(/no progress notes yet/i)).toBeInTheDocument();
    expect(fetchProjectIdeaRequestMock).toHaveBeenCalledWith("token-123", "idea-1");
  });

  it("adds a progress note and renders the returned history", async () => {
    const user = userEvent.setup();
    addProjectIdeaProgressNoteRequestMock.mockResolvedValue({ idea: { ...idea, progressNotes: [{ id: "note-1", text: "Tested the first prototype", createdAt: "2026-07-18T00:00:00.000Z" }] } });
    renderPage();
    await screen.findByRole("heading", { name: /focus timer/i });
    await user.type(screen.getByLabelText(/what changed/i), " Tested the first prototype ");
    await user.click(screen.getByRole("button", { name: /add progress note/i }));
    await waitFor(() => expect(addProjectIdeaProgressNoteRequestMock).toHaveBeenCalledWith("token-123", "idea-1", { text: "Tested the first prototype" }));
    expect(await screen.findByText("Tested the first prototype")).toBeInTheDocument();
  });

  it("shows progress history newest first", async () => {
    fetchProjectIdeaRequestMock.mockResolvedValue({ idea: { ...idea, progressNotes: [
      { id: "note-old", text: "Outlined the scope", createdAt: "2026-07-17T00:00:00.000Z" },
      { id: "note-new", text: "Tested the prototype", createdAt: "2026-07-18T00:00:00.000Z" }
    ] } });
    renderPage();
    await screen.findByText("Newest first");
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      expect.stringContaining("Tested the prototype"),
      expect.stringContaining("Outlined the scope")
    ]);
  });
  it("keeps a progress-note error by the form", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole("heading", { name: /focus timer/i });
    const form = screen.getByRole("heading", { name: /record an improvement/i }).closest("section");
    await user.click(within(form).getByRole("button", { name: /add progress note/i }));
    expect(screen.getByText(/progress note is required/i)).toBeInTheDocument();
    expect(addProjectIdeaProgressNoteRequestMock).not.toHaveBeenCalled();
  });

  it("confirms deletion and returns to the project ideas list", async () => {
    const user = userEvent.setup();
    deleteProjectIdeaRequestMock.mockResolvedValue({ message: "Project idea deleted." });
    renderPage();
    await screen.findByRole("heading", { name: /focus timer/i });
    await user.click(screen.getByRole("button", { name: /^delete idea$/i }));
    const dialog = screen.getByRole("dialog", { name: /delete project idea/i });
    expect(dialog).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: /^delete idea$/i }));
    await waitFor(() => expect(deleteProjectIdeaRequestMock).toHaveBeenCalledWith("token-123", "idea-1"));
    expect(await screen.findByText("Project ideas list")).toBeInTheDocument();
  });
});