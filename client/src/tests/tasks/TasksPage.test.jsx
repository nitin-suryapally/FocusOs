import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TasksPage } from "../../features/tasks/pages/TasksPage";
import { fetchResourcesRequest } from "../../features/resources/api/resourcesApi";

const fetchTasksRequestMock = vi.fn();
const createTaskRequestMock = vi.fn();
const updateTaskRequestMock = vi.fn();
const deleteTaskRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();
const fetchResourcesRequestMock = vi.fn();

vi.mock("../../features/tasks/api/tasksApi", () => ({
  fetchTasksRequest: (...args) => fetchTasksRequestMock(...args),
  createTaskRequest: (...args) => createTaskRequestMock(...args),
  updateTaskRequest: (...args) => updateTaskRequestMock(...args),
  deleteTaskRequest: (...args) => deleteTaskRequestMock(...args)
}));

vi.mock("../../features/resources/api/resourcesApi", () => ({
  fetchResourcesRequest: (...args) => fetchResourcesRequestMock(...args)
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
    fetchResourcesRequestMock.mockResolvedValue({ resources: [] });
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

  it("opens and closes the create modal with an overlay", async () => {
    const user = userEvent.setup();

    renderTasksPage();

    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByTestId("task-create-overlay")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog", { name: /capture the next task before it slips away/i });

    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getAllByRole("button", { name: /^cancel$/i })[0]);

    expect(screen.queryByRole("dialog", { name: /capture the next task before it slips away/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-create-overlay")).not.toBeInTheDocument();
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

  it("shows client-side validation errors before creating a task", async () => {
    const user = userEvent.setup();

    renderTasksPage();

    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add task/i }));

    const dialog = screen.getByRole("dialog", { name: /capture the next task before it slips away/i });

    await user.click(within(dialog).getByRole("button", { name: /save task/i }));

    expect(within(dialog).getByText(/title is required/i)).toBeInTheDocument();
    expect(createTaskRequestMock).not.toHaveBeenCalled();
  });

  it("creates a task and adds it to the grouped view", async () => {
    const user = userEvent.setup();
    const today = new Date();

    createTaskRequestMock.mockResolvedValue({
      message: "Task created.",
      task: {
        id: "task-1",
        title: "Prepare weekly review",
        type: "general",
        priority: "high",
        dueDate: today.toISOString(),
        completed: false,
        topic: "Planning"
      }
    });

    renderTasksPage();

    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add task/i }));

    const dialog = screen.getByRole("dialog", { name: /capture the next task before it slips away/i });

    await user.type(within(dialog).getByLabelText(/^title$/i), "Prepare weekly review");
    await user.type(within(dialog).getByLabelText(/^topic$/i), "Planning");
    await user.selectOptions(within(dialog).getByLabelText(/^priority$/i), "high");
    await user.type(within(dialog).getByLabelText(/^due date$/i), today.toISOString().slice(0, 10));
    await user.click(within(dialog).getByRole("button", { name: /save task/i }));

    await waitFor(() => {
      expect(createTaskRequestMock).toHaveBeenCalledWith("token-123", {
        title: "Prepare weekly review",
        topic: "Planning",
        type: "general",
        priority: "high",
        dueDate: today.toISOString().slice(0, 10),
        completed: false,
        resourceId: null
      });
    });

    expect(screen.queryByRole("dialog", { name: /capture the next task before it slips away/i })).not.toBeInTheDocument();
    expect(await screen.findByText(/task created/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Today$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /prepare weekly review/i })).toBeInTheDocument();
    expect(screen.getAllByText(/^1$/)).toHaveLength(2);
  });

  it("shows a create error returned by the backend inside the modal", async () => {
    const user = userEvent.setup();
    createTaskRequestMock.mockRejectedValue(new Error("Task due date is invalid."));

    renderTasksPage();

    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add task/i }));

    const dialog = screen.getByRole("dialog", { name: /capture the next task before it slips away/i });

    await user.type(within(dialog).getByLabelText(/^title$/i), "Bad due date task");
    await user.click(within(dialog).getByRole("button", { name: /save task/i }));

    expect(await within(dialog).findByText(/task due date is invalid/i)).toBeInTheDocument();
    expect(createTaskRequestMock).toHaveBeenCalledTimes(1);
  });

  it("renders grouped task sections and summary cards", async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    fetchTasksRequestMock.mockResolvedValue({
      tasks: [
        {
          id: "task-1",
          title: "Ship task backend",
          type: "learning",
          priority: "high",
          dueDate: today.toISOString(),
          completed: false,
          topic: "Backend"
        },
        {
          id: "task-2",
          title: "Plan auth cleanup",
          type: "general",
          priority: "medium",
          dueDate: tomorrow.toISOString(),
          completed: false,
          topic: "Authentication"
        },
        {
          id: "task-3",
          title: "Capture backlog item",
          type: "general",
          priority: "low",
          dueDate: null,
          completed: false,
          topic: "Planning"
        },
        {
          id: "task-4",
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

    expect(await screen.findByRole("heading", { name: /^Today$/i })).toBeInTheDocument();
    expect(screen.getByText(/^4$/)).toBeInTheDocument();
    expect(screen.getByText(/^3$/)).toBeInTheDocument();
    expect(screen.getByText(/^1$/)).toBeInTheDocument();

    const todaySection = screen.getByRole("heading", { name: /^Today$/i }).closest("section");
    const upcomingSection = screen.getByRole("heading", { name: /^Upcoming$/i }).closest("section");
    const completedSection = screen.getByRole("heading", { name: /^Completed$/i }).closest("section");

    expect(within(todaySection).getByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();
    expect(within(upcomingSection).getByRole("heading", { name: /plan auth cleanup/i })).toBeInTheDocument();
    expect(within(upcomingSection).getByRole("heading", { name: /capture backlog item/i })).toBeInTheDocument();
    expect(within(completedSection).getByRole("heading", { name: /review auth flow/i })).toBeInTheDocument();
    expect(within(completedSection).getByText(/no due date/i)).toBeInTheDocument();
  });

  it("optimistically moves a task into Completed while the toggle request is in flight", async () => {
    const user = userEvent.setup();
    const today = new Date();
    let resolveUpdateRequest;

    fetchTasksRequestMock.mockResolvedValue({
      tasks: [
        {
          id: "task-1",
          title: "Ship task backend",
          type: "learning",
          priority: "high",
          dueDate: today.toISOString(),
          completed: false,
          topic: "Backend"
        }
      ]
    });

    updateTaskRequestMock.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdateRequest = resolve;
      })
    );

    renderTasksPage();

    expect(await screen.findByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();

    const todaySection = screen.getByRole("heading", { name: /^Today$/i }).closest("section");
    const completedSection = screen.getByRole("heading", { name: /^Completed$/i }).closest("section");
    const taskCard = within(todaySection).getByRole("heading", { name: /ship task backend/i }).closest("article");

    await user.click(within(taskCard).getByRole("button", { name: /mark complete/i }));

    await waitFor(() => {
      expect(updateTaskRequestMock).toHaveBeenCalledWith("token-123", "task-1", { completed: true });
    });

    expect(within(todaySection).queryByRole("heading", { name: /ship task backend/i })).not.toBeInTheDocument();
    expect(within(completedSection).getByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();
    expect(screen.getByText(/^0$/)).toBeInTheDocument();
    expect(screen.getAllByText(/^1$/)).toHaveLength(2);

    resolveUpdateRequest({
      message: "Task updated.",
      task: {
        id: "task-1",
        title: "Ship task backend",
        type: "learning",
        priority: "high",
        dueDate: today.toISOString(),
        completed: true,
        topic: "Backend"
      }
    });

    await waitFor(() => {
      expect(within(completedSection).getByRole("button", { name: /mark open/i })).toBeInTheDocument();
    });
  });

  it("rolls a task back into its original group when the toggle request fails", async () => {
    const user = userEvent.setup();
    const today = new Date();
    let rejectUpdateRequest;

    fetchTasksRequestMock.mockResolvedValue({
      tasks: [
        {
          id: "task-1",
          title: "Ship task backend",
          type: "learning",
          priority: "high",
          dueDate: today.toISOString(),
          completed: false,
          topic: "Backend"
        }
      ]
    });

    updateTaskRequestMock.mockReturnValue(
      new Promise((_, reject) => {
        rejectUpdateRequest = reject;
      })
    );

    renderTasksPage();

    expect(await screen.findByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();

    const todaySection = screen.getByRole("heading", { name: /^Today$/i }).closest("section");
    const completedSection = screen.getByRole("heading", { name: /^Completed$/i }).closest("section");
    const taskCard = within(todaySection).getByRole("heading", { name: /ship task backend/i }).closest("article");

    await user.click(within(taskCard).getByRole("button", { name: /mark complete/i }));

    expect(within(completedSection).getByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();

    rejectUpdateRequest(new Error("Unable to update task status."));

    expect(await screen.findByText(/unable to update task status/i)).toBeInTheDocument();
    expect(within(todaySection).getByRole("heading", { name: /ship task backend/i })).toBeInTheDocument();
    expect(within(completedSection).queryByRole("heading", { name: /ship task backend/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/^1$/)).toHaveLength(2);
    expect(screen.getByText(/^0$/)).toBeInTheDocument();
  });
  it("updates task details from the edit modal", async () => {
    const user = userEvent.setup();

    fetchTasksRequestMock.mockResolvedValue({
      tasks: [{ id: "task-1", title: "Draft plan", type: "general", priority: "medium", dueDate: null, completed: false, topic: "Planning" }]
    });
    updateTaskRequestMock.mockResolvedValue({
      message: "Task updated.",
      task: { id: "task-1", title: "Finalize plan", type: "general", priority: "high", dueDate: null, completed: false, topic: "Planning" }
    });

    renderTasksPage();

    const taskHeading = await screen.findByRole("heading", { name: /draft plan/i });
    const taskCard = taskHeading.closest("article");
    await user.click(within(taskCard).getByRole("button", { name: /edit task/i }));

    const dialog = screen.getByRole("dialog", { name: /keep this task current/i });
    await user.clear(within(dialog).getByLabelText(/^title$/i));
    await user.type(within(dialog).getByLabelText(/^title$/i), "Finalize plan");
    await user.selectOptions(within(dialog).getByLabelText(/^priority$/i), "high");
    await user.click(within(dialog).getByRole("button", { name: /update task/i }));

    await waitFor(() => {
      expect(updateTaskRequestMock).toHaveBeenCalledWith("token-123", "task-1", {
        title: "Finalize plan", topic: "Planning", type: "general", priority: "high", dueDate: null, completed: false,
        resourceId: null
      });
    });
    expect(await screen.findByText(/task updated/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /finalize plan/i })).toBeInTheDocument();
  });

  it("deletes a task after confirmation", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    fetchTasksRequestMock.mockResolvedValue({
      tasks: [{ id: "task-1", title: "Remove me", type: "general", priority: "medium", dueDate: null, completed: false, topic: "Planning" }]
    });
    deleteTaskRequestMock.mockResolvedValue({ message: "Task deleted." });

    renderTasksPage();

    const taskHeading = await screen.findByRole("heading", { name: /remove me/i });
    await user.click(within(taskHeading.closest("article")).getByRole("button", { name: /delete task/i }));
    await user.click(within(screen.getByTestId("task-delete-confirmation")).getByRole("button", { name: /^delete task$/i }));

    await waitFor(() => expect(deleteTaskRequestMock).toHaveBeenCalledWith("token-123", "task-1"));
    expect(await screen.findByText(/task deleted/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /remove me/i })).not.toBeInTheDocument();
  });

  it("keeps a task visible and reports a delete failure", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    fetchTasksRequestMock.mockResolvedValue({
      tasks: [{ id: "task-1", title: "Keep me", type: "general", priority: "medium", dueDate: null, completed: false, topic: "Planning" }]
    });
    deleteTaskRequestMock.mockRejectedValue(new Error("Unable to delete task."));

    renderTasksPage();

    const taskHeading = await screen.findByRole("heading", { name: /keep me/i });
    await user.click(within(taskHeading.closest("article")).getByRole("button", { name: /delete task/i }));
    await user.click(within(screen.getByTestId("task-delete-confirmation")).getByRole("button", { name: /^delete task$/i }));

    expect(await screen.findByText(/unable to delete task/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /keep me/i })).toBeInTheDocument();
  });
  it("links a saved resource when creating a task", async () => {
    const user = userEvent.setup();
    fetchResourcesRequestMock.mockResolvedValue({ resources: [{ id: "resource-1", title: "React guide", topic: "Frontend" }] });
    createTaskRequestMock.mockResolvedValue({
      message: "Task created.",
      task: { id: "task-1", title: "Read React guide", type: "learning", priority: "medium", dueDate: null, completed: false, topic: "Frontend", resource: { id: "resource-1", title: "React guide", topic: "Frontend" } }
    });

    renderTasksPage();
    expect(await screen.findByText(/no tasks added yet/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /add task/i }));
    const dialog = screen.getByRole("dialog", { name: /capture the next task/i });
    await user.type(within(dialog).getByLabelText(/^title$/i), "Read React guide");
    await user.selectOptions(within(dialog).getByLabelText(/linked resource/i), "resource-1");
    await user.click(within(dialog).getByRole("button", { name: /save task/i }));

    await waitFor(() => expect(createTaskRequestMock).toHaveBeenCalledWith("token-123", expect.objectContaining({ resourceId: "resource-1" })));
    expect(await screen.findByText("React guide")).toBeInTheDocument();
  });
});
