import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResourcesPage } from "../../features/resources/pages/ResourcesPage";
import { ResourceSkillPage } from "../../features/resources/pages/ResourceSkillPage";

const fetchResourcesRequestMock = vi.fn();
const createResourceRequestMock = vi.fn();
const updateResourceRequestMock = vi.fn();
const deleteResourceRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();

vi.mock("../../features/resources/api/resourcesApi", () => ({
  fetchResourcesRequest: (...args) => fetchResourcesRequestMock(...args),
  createResourceRequest: (...args) => createResourceRequestMock(...args),
  updateResourceRequest: (...args) => updateResourceRequestMock(...args),
  deleteResourceRequest: (...args) => deleteResourceRequestMock(...args)
}));

vi.mock("../../store/useAuthStore", () => ({
  useAuthToken: () => useAuthTokenMock()
}));

const renderResourcesPage = () =>
  render(
    <MemoryRouter>
      <ResourcesPage />
    </MemoryRouter>
  );

const renderResourceRoutes = (initialPath, element = <ResourceSkillPage />) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/app/resources" element={<ResourcesPage />} />
        <Route path="/app/resources/:skillPageId" element={element} />
      </Routes>
    </MemoryRouter>
  );

describe("ResourcesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthTokenMock.mockReturnValue("token-123");
    fetchResourcesRequestMock.mockResolvedValue({ resources: [] });
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  it("shows the loading state before rendering an empty state", async () => {
    let resolveRequest;
    fetchResourcesRequestMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderResourcesPage();

    expect(screen.getByLabelText(/resources loading state/i)).toBeInTheDocument();

    resolveRequest({ resources: [] });

    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/resources loading state/i)).not.toBeInTheDocument();
  });

  it("opens and closes the create modal with an overlay", async () => {
    const user = userEvent.setup();

    renderResourcesPage();

    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add resource/i }));

    expect(screen.getByTestId("resource-create-overlay")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog", { name: /save something worth returning to/i });

    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getAllByRole("button", { name: /^cancel$/i })[0]);

    expect(screen.queryByRole("dialog", { name: /save something worth returning to/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId("resource-create-overlay")).not.toBeInTheDocument();
  });

  it("shows an error state and retries the request", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock
      .mockRejectedValueOnce(new Error("Server is unavailable."))
      .mockResolvedValueOnce({ resources: [] });

    renderResourcesPage();

    expect(await screen.findByText(/the library is unavailable right now/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => {
      expect(fetchResourcesRequestMock).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();
  });

  it("shows only skill page titles and descriptions in the library and opens the skill page", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock.mockResolvedValue({
      resources: [
        {
          id: "resource-1",
          title: "React Patterns",
          topic: "React",
          type: "article",
          status: "saved",
          url: "https://example.com/react-patterns",
          tags: ["hooks", "components"],
          notes: "Great refresher on composition.",
          createdAt: "2026-07-12T00:00:00.000Z",
          updatedAt: "2026-07-13T00:00:00.000Z"
        },
        {
          id: "resource-2",
          title: "Testing Library Guide",
          topic: "Testing",
          type: "document",
          status: "in_progress",
          url: "",
          tags: [],
          notes: "",
          createdAt: "2026-07-10T00:00:00.000Z",
          updatedAt: "2026-07-11T00:00:00.000Z"
        },
        {
          id: "resource-3",
          title: "Advanced Hooks",
          topic: "React",
          type: "video",
          status: "completed",
          url: "https://example.com/advanced-hooks",
          tags: ["hooks"],
          notes: "Watch this before state refactors.",
          createdAt: "2026-07-09T00:00:00.000Z",
          updatedAt: "2026-07-10T00:00:00.000Z"
        }
      ]
    });

    render(
      <MemoryRouter initialEntries={["/app/resources"]}>
        <Routes>
          <Route path="/app/resources" element={<ResourcesPage />} />
          <Route path="/app/resources/:skillPageId" element={<ResourceSkillPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: /^resource library$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /react/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /testing/i })).toBeInTheDocument();
    expect(screen.getByText(/2 resources across 1 article/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /react patterns/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /advanced hooks/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /react/i }));

    expect(await screen.findByRole("heading", { name: /^react$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /saved materials for this skill/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /react patterns/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /advanced hooks/i })).toBeInTheDocument();
    expect(screen.getByText(/watch this before state refactors/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /open resource/i })[0]).toHaveAttribute(
      "href",
      "https://example.com/react-patterns"
    );
  });

  it("filters the library by search, status, type, topic, and tag", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock.mockResolvedValue({
      resources: [
        {
          id: "resource-1",
          title: "React Patterns",
          topic: "React",
          type: "article",
          status: "saved",
          url: "https://example.com/react-patterns",
          tags: ["hooks", "components"],
          notes: "Great refresher on composition.",
          createdAt: "2026-07-12T00:00:00.000Z",
          updatedAt: "2026-07-13T00:00:00.000Z"
        },
        {
          id: "resource-2",
          title: "Testing Library Guide",
          topic: "Testing",
          type: "document",
          status: "in_progress",
          url: "",
          tags: ["qa"],
          notes: "Includes query tips.",
          createdAt: "2026-07-10T00:00:00.000Z",
          updatedAt: "2026-07-11T00:00:00.000Z"
        },
        {
          id: "resource-3",
          title: "Advanced Hooks",
          topic: "React",
          type: "video",
          status: "completed",
          url: "https://example.com/advanced-hooks",
          tags: ["hooks"],
          notes: "Watch this before state refactors.",
          createdAt: "2026-07-09T00:00:00.000Z",
          updatedAt: "2026-07-10T00:00:00.000Z"
        }
      ]
    });

    renderResourcesPage();

    expect(await screen.findByRole("heading", { name: /^resource library$/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^search$/i), "hook");
    expect(screen.getByRole("link", { name: /react/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /testing/i })).not.toBeInTheDocument();
    expect(screen.getByText(/1 skill page from 2 resources/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/^status$/i), "completed");
    expect(screen.getByText(/1 skill page from 1 resource/i)).toBeInTheDocument();
    expect(screen.getByText(/1 resource across 1 video/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/^type$/i), "video");
    await user.selectOptions(screen.getByLabelText(/^topic$/i), "React");
    await user.selectOptions(screen.getByLabelText(/^tag$/i), "hooks");

    expect(screen.getByRole("link", { name: /react/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /testing/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(screen.getByRole("link", { name: /react/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /testing/i })).toBeInTheDocument();
    expect(screen.getByText(/2 skill pages from 3 resources/i)).toBeInTheDocument();
  });

  it("shows a no-match state when filters exclude every skill page", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock.mockResolvedValue({
      resources: [
        {
          id: "resource-1",
          title: "React Patterns",
          topic: "React",
          type: "article",
          status: "saved",
          url: "https://example.com/react-patterns",
          tags: ["hooks", "components"],
          notes: "Great refresher on composition.",
          createdAt: "2026-07-12T00:00:00.000Z",
          updatedAt: "2026-07-13T00:00:00.000Z"
        }
      ]
    });

    renderResourcesPage();

    expect(await screen.findByRole("heading", { name: /^resource library$/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^search$/i), "python");

    expect(screen.getByText(/no skill pages match the current filters/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /react/i })).not.toBeInTheDocument();
  });

  it("updates a resource from the skill detail page", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock.mockResolvedValue({
      resources: [
        {
          id: "resource-1",
          title: "React Patterns",
          topic: "React",
          type: "article",
          status: "saved",
          url: "https://example.com/react-patterns",
          tags: ["hooks", "components"],
          notes: "Great refresher on composition.",
          createdAt: "2026-07-12T00:00:00.000Z",
          updatedAt: "2026-07-13T00:00:00.000Z"
        }
      ]
    });
    updateResourceRequestMock.mockResolvedValue({
      message: "Resource updated.",
      resource: {
        id: "resource-1",
        title: "React Patterns",
        topic: "React",
        type: "article",
        status: "completed",
        url: "https://example.com/react-patterns",
        tags: ["hooks", "components"],
        notes: "Completed and reviewed.",
        createdAt: "2026-07-12T00:00:00.000Z",
        updatedAt: "2026-07-14T00:00:00.000Z"
      }
    });

    renderResourceRoutes("/app/resources/react");

    expect(await screen.findByRole("heading", { name: /^react$/i })).toBeInTheDocument();

    const resourceCard = screen.getByRole("heading", { name: /react patterns/i }).closest("article");

    await user.click(within(resourceCard).getByRole("button", { name: /edit resource/i }));

    const dialog = screen.getByRole("dialog", { name: /update this resource/i });

    await user.selectOptions(within(dialog).getByLabelText(/^status$/i), "completed");
    await user.clear(within(dialog).getByLabelText(/^notes$/i));
    await user.type(within(dialog).getByLabelText(/^notes$/i), "Completed and reviewed.");
    await user.click(within(dialog).getByRole("button", { name: /update resource/i }));

    await waitFor(() => {
      expect(updateResourceRequestMock).toHaveBeenCalledWith("token-123", "resource-1", {
        title: "React Patterns",
        topic: "React",
        type: "article",
        status: "completed",
        url: "https://example.com/react-patterns",
        tags: ["hooks", "components"],
        notes: "Completed and reviewed."
      });
    });

    expect(screen.queryByRole("dialog", { name: /update this resource/i })).not.toBeInTheDocument();
    expect(await screen.findByText(/resource updated/i)).toBeInTheDocument();
    expect(screen.getByText(/completed and reviewed/i)).toBeInTheDocument();
  });

  it("deletes a resource from the skill detail page", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock.mockResolvedValue({
      resources: [
        {
          id: "resource-1",
          title: "React Patterns",
          topic: "React",
          type: "article",
          status: "saved",
          url: "https://example.com/react-patterns",
          tags: ["hooks", "components"],
          notes: "Great refresher on composition.",
          createdAt: "2026-07-12T00:00:00.000Z",
          updatedAt: "2026-07-13T00:00:00.000Z"
        },
        {
          id: "resource-2",
          title: "Advanced Hooks",
          topic: "React",
          type: "video",
          status: "completed",
          url: "https://example.com/advanced-hooks",
          tags: ["hooks"],
          notes: "Watch this before state refactors.",
          createdAt: "2026-07-09T00:00:00.000Z",
          updatedAt: "2026-07-10T00:00:00.000Z"
        }
      ]
    });
    deleteResourceRequestMock.mockResolvedValue({ message: "Resource deleted." });

    renderResourceRoutes("/app/resources/react");

    expect(await screen.findByRole("heading", { name: /^react$/i })).toBeInTheDocument();

    const resourceCard = screen.getByRole("heading", { name: /advanced hooks/i }).closest("article");

    await user.click(within(resourceCard).getByRole("button", { name: /delete resource/i }));

    await waitFor(() => {
      expect(deleteResourceRequestMock).toHaveBeenCalledWith("token-123", "resource-2");
    });

    expect(await screen.findByText(/resource deleted/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /advanced hooks/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /react patterns/i })).toBeInTheDocument();
  });

  it("shows client-side validation errors before creating a resource", async () => {
    const user = userEvent.setup();

    renderResourcesPage();

    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add resource/i }));

    const dialog = screen.getByRole("dialog", { name: /save something worth returning to/i });

    await user.click(within(dialog).getByRole("button", { name: /save resource/i }));

    expect(within(dialog).getByText(/title is required/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/topic is required/i)).toBeInTheDocument();
    expect(createResourceRequestMock).not.toHaveBeenCalled();
  });

  it("creates a resource and adds it to the rendered list", async () => {
    const user = userEvent.setup();
    createResourceRequestMock.mockResolvedValue({
      message: "Resource created.",
      resource: {
        id: "resource-3",
        title: "Node Streams Deep Dive",
        topic: "Node.js",
        type: "video",
        status: "in_progress",
        url: "https://example.com/node-streams",
        tags: ["streams", "backend"],
        notes: "Watch before rebuilding uploads.",
        createdAt: "2026-07-13T00:00:00.000Z",
        updatedAt: "2026-07-13T00:00:00.000Z"
      }
    });

    renderResourcesPage();

    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add resource/i }));

    const dialog = screen.getByRole("dialog", { name: /save something worth returning to/i });

    await user.type(within(dialog).getByLabelText(/^title$/i), "Node Streams Deep Dive");
    await user.type(within(dialog).getByLabelText(/^topic$/i), "Node.js");
    await user.selectOptions(within(dialog).getByLabelText(/^type$/i), "video");
    await user.selectOptions(within(dialog).getByLabelText(/^status$/i), "in_progress");
    await user.type(within(dialog).getByLabelText(/^url$/i), "https://example.com/node-streams");
    await user.type(within(dialog).getByLabelText(/^tags$/i), "streams, backend");
    await user.type(within(dialog).getByLabelText(/^notes$/i), "Watch before rebuilding uploads.");
    await user.click(within(dialog).getByRole("button", { name: /save resource/i }));

    await waitFor(() => {
      expect(createResourceRequestMock).toHaveBeenCalledWith("token-123", {
        title: "Node Streams Deep Dive",
        topic: "Node.js",
        type: "video",
        status: "in_progress",
        url: "https://example.com/node-streams",
        tags: ["streams", "backend"],
        notes: "Watch before rebuilding uploads."
      });
    });

    expect(screen.queryByRole("dialog", { name: /save something worth returning to/i })).not.toBeInTheDocument();
    expect(await screen.findByText(/resource created/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^resource library$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /node\.js/i })).toBeInTheDocument();
    expect(screen.queryByText(/watch before rebuilding uploads/i)).not.toBeInTheDocument();
  });

  it("shows a create error returned by the backend inside the modal", async () => {
    const user = userEvent.setup();
    createResourceRequestMock.mockRejectedValue(new Error("Resource URL is invalid."));

    renderResourcesPage();

    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add resource/i }));

    const dialog = screen.getByRole("dialog", { name: /save something worth returning to/i });

    await user.type(within(dialog).getByLabelText(/^title$/i), "Bad URL Resource");
    await user.type(within(dialog).getByLabelText(/^topic$/i), "Validation");
    await user.type(within(dialog).getByLabelText(/^url$/i), "https://example.com/validation");
    await user.click(within(dialog).getByRole("button", { name: /save resource/i }));

    expect(await within(dialog).findByText(/resource url is invalid/i)).toBeInTheDocument();
    expect(createResourceRequestMock).toHaveBeenCalledTimes(1);
  });
});
