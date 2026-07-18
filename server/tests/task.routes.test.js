import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

const mockListTasks = vi.fn();
const mockCreateTask = vi.fn();
const mockGetTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();

vi.mock("../src/services/taskService.js", () => ({
  listTasks: mockListTasks,
  createTask: mockCreateTask,
  getTask: mockGetTask,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask
}));

const mockVerify = vi.fn();

vi.mock("jsonwebtoken", async () => {
  const actual = await vi.importActual("jsonwebtoken");

  return {
    ...actual,
    default: {
      ...actual.default,
      verify: mockVerify
    },
    verify: mockVerify
  };
});

const { createApp } = await import("../src/app.js");

describe("task routes", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockVerify.mockReturnValue({ sub: "user-1" });
  });

  it("rejects unauthenticated task requests", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
    expect(mockListTasks).not.toHaveBeenCalled();
  });

  it("lists tasks for the authenticated user", async () => {
    mockListTasks.mockResolvedValue([{ id: "task-1", title: "Ship task backend" }]);

    const response = await request(app).get("/api/tasks").set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tasks: [{ id: "task-1", title: "Ship task backend" }]
    });
    expect(mockListTasks).toHaveBeenCalledWith("user-1");
  });

  it("creates a task for the authenticated user", async () => {
    mockCreateTask.mockResolvedValue({
      id: "task-1",
      title: "Ship task backend",
      priority: "high"
    });

    const payload = {
      title: "Ship task backend",
      type: "learning",
      priority: "high",
      dueDate: "2026-07-20T00:00:00.000Z",
      completed: false,
      topic: "Backend"
    };

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", "Bearer valid-token")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Task created.",
      task: {
        id: "task-1",
        title: "Ship task backend",
        priority: "high"
      }
    });
    expect(mockCreateTask).toHaveBeenCalledWith("user-1", payload);
  });

  it("rejects invalid task create payloads before service execution", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", "Bearer valid-token")
      .send({
        title: "",
        priority: "high"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title is required.");
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("gets one owned task", async () => {
    mockGetTask.mockResolvedValue({
      id: "task-1",
      title: "Ship task backend"
    });

    const response = await request(app)
      .get("/api/tasks/task-1")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      task: {
        id: "task-1",
        title: "Ship task backend"
      }
    });
    expect(mockGetTask).toHaveBeenCalledWith("user-1", "task-1");
  });

  it("updates one owned task", async () => {
    mockUpdateTask.mockResolvedValue({
      id: "task-1",
      completed: true
    });

    const response = await request(app)
      .patch("/api/tasks/task-1")
      .set("Authorization", "Bearer valid-token")
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Task updated.",
      task: {
        id: "task-1",
        completed: true
      }
    });
    expect(mockUpdateTask).toHaveBeenCalledWith("user-1", "task-1", {
      completed: true
    });
  });

  it("rejects empty task updates", async () => {
    const response = await request(app)
      .patch("/api/tasks/task-1")
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("At least one task field is required.");
    expect(mockUpdateTask).not.toHaveBeenCalled();
  });

  it("deletes one owned task", async () => {
    mockDeleteTask.mockResolvedValue();

    const response = await request(app)
      .delete("/api/tasks/task-1")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Task deleted."
    });
    expect(mockDeleteTask).toHaveBeenCalledWith("user-1", "task-1");
  });
  it("rejects malformed linked resource ids before service execution", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", "Bearer valid-token")
      .send({ title: "Read guide", resourceId: "not-an-id" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Linked resource is invalid.");
    expect(mockCreateTask).not.toHaveBeenCalled();
  });
});
