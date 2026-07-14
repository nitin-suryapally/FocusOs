import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TasksPage } from "../../features/tasks/pages/TasksPage";

const fetchTasksRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();

vi.mock("../../features/tasks/api/tasksApi", () => ({
  fetchTasksRequest: (...args) => fetchTasksRequestMock(...args)
}));

vi.mock("../../store/useAuthStore", () => ({
  useAuthToken: () => useAuthTokenMock()
}));

const renderTasksPage = () =>
  render(
    <MemoryRouter>
      <TasksPage />
    </MemoryRouter>
  );

describe("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthTokenMock.mockReturnValue("token-123");
    fetchTasksRequestMock.mockResolvedValue({ tasks: [] });
  });

  it("shows the loading state before rendering an empty state", async () => {
    let resolveRequest;
    fetchTasksRequestMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderTasksPage();

    expect(screen.getByLabelText(/tasks loading state/i)).toBeInTheDocument();

    resolveRequest({ tasks: [] });

    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/tasks loading state/i)).not.toBeInTheDocument();
  });

  it("shows an error state and retries the request", async () => {
    const user = userEvent.setup();
    fetchTasksRequestMock
      .mockRejectedValueOnce(new Error("Server is unavailable."))
      .mockResolvedValueOnce({ tasks: [] });

    renderTasksPage();

    expect(await screen.findByText(/the tasks workspace is unavailable right now/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => {
      expect(fetchTasksRequestMock).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();
  });

  it("shows the empty state when no tasks are returned", async () => {
    renderTasksPage();

    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();
    expect(screen.getByText(/general and learning tasks will show up here/i)).toBeInTheDocument();
  });

  it("renders the loaded task feed and summary cards", async () => {
    fetchTasksRequestMock.mockResolvedValue({
      tasks: [
        {
          id: "task-1",
          title: "Ship task backend",
          type: "learning",
          priority: "high",
          dueDate: "2026-07-20T00:00:00.000Z",
          completed: false,
          topic: "Backend"
        },
        {
          id: "task-2",
          title: "Review auth flow",
          type: "general",
          priority: "medium",
          dueDate: null,
          completed: true,
          topic: "Authentication"
        }
      ]
    });

    renderTasksPage();

    expect(await screen.findByRole("heading", { name: /current tasks/i })).toBeInTheDocument();
    expect(screen.getByText(/^2$/)).toBeInTheDocument();
    expect(screen.getAllByText(/^1$/)).toHaveLength(2);
    expect(screen.getByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /review auth flow/i })).toBeInTheDocument();
    expect(screen.getByText(/^Backend$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Authentication$/i)).toBeInTheDocument();
    expect(screen.getByText(/no due date/i)).toBeInTheDocument();
  });
});
