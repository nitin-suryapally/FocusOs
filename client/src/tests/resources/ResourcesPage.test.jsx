import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResourcesPage } from "../../features/resources/pages/ResourcesPage";

const fetchResourcesRequestMock = vi.fn();
const createResourceRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();

vi.mock("../../features/resources/api/resourcesApi", () => ({
  fetchResourcesRequest: (...args) => fetchResourcesRequestMock(...args),
  createResourceRequest: (...args) => createResourceRequestMock(...args)
}));

vi.mock("../../store/useAuthStore", () => ({
  useAuthToken: () => useAuthTokenMock()
}));

describe("ResourcesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthTokenMock.mockReturnValue("token-123");
    fetchResourcesRequestMock.mockResolvedValue({ resources: [] });
  });

  it("shows the loading state before rendering an empty state", async () => {
    let resolveRequest;
    fetchResourcesRequestMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    render(<ResourcesPage />);

    expect(screen.getByLabelText(/resources loading state/i)).toBeInTheDocument();

    resolveRequest({ resources: [] });

    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/resources loading state/i)).not.toBeInTheDocument();
  });

  it("opens and closes the create modal with an overlay", async () => {
    const user = userEvent.setup();

    render(<ResourcesPage />);

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

    render(<ResourcesPage />);

    expect(await screen.findByText(/the library is unavailable right now/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => {
      expect(fetchResourcesRequestMock).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText(/no resources saved yet/i)).toBeInTheDocument();
  });

  it("renders the backend resource list when resources exist", async () => {
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
        }
      ]
    });

    render(<ResourcesPage />);

    expect(await screen.findByRole("heading", { name: /saved materials from the backend/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /react patterns/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /testing library guide/i })).toBeInTheDocument();
    expect(screen.getByText(/topic: react/i)).toBeInTheDocument();
    expect(screen.getByText(/great refresher on composition/i)).toBeInTheDocument();
    expect(screen.getByText(/hooks, components/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open resource/i })).toHaveAttribute(
      "href",
      "https://example.com/react-patterns"
    );
    expect(screen.getAllByText(/^2$/)).toHaveLength(2);
    expect(fetchResourcesRequestMock).toHaveBeenCalledWith("token-123");
  });

  it("shows client-side validation errors before creating a resource", async () => {
    const user = userEvent.setup();

    render(<ResourcesPage />);

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

    render(<ResourcesPage />);

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
    expect(screen.getByRole("heading", { name: /saved materials from the backend/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /node streams deep dive/i })).toBeInTheDocument();
    expect(screen.getByText(/watch before rebuilding uploads/i)).toBeInTheDocument();
    expect(screen.getByText(/streams, backend/i)).toBeInTheDocument();
  });

  it("shows a create error returned by the backend inside the modal", async () => {
    const user = userEvent.setup();
    createResourceRequestMock.mockRejectedValue(new Error("Resource URL is invalid."));

    render(<ResourcesPage />);

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
