import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFind = vi.fn();
const mockCreate = vi.fn();
const mockFindOne = vi.fn();
const mockFindOneAndUpdate = vi.fn();

vi.mock("../src/models/Task.js", () => ({
  Task: {
    find: mockFind,
    create: mockCreate,
    findOne: mockFindOne,
    findOneAndUpdate: mockFindOneAndUpdate
  }
}));

const { createTask, deleteTask, getTask, listTasks, updateTask } = await import("../src/services/taskService.js");

describe("task service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists tasks scoped to a user", async () => {
    const sortMock = vi.fn().mockResolvedValue([
      {
        toSafeObject: () => ({ id: "task-1", title: "Ship task backend" })
      }
    ]);
    mockFind.mockReturnValue({ sort: sortMock });

    const result = await listTasks("user-1");

    expect(mockFind).toHaveBeenCalledWith({ user: "user-1" });
    expect(sortMock).toHaveBeenCalledWith({ completed: 1, dueDate: 1, updatedAt: -1 });
    expect(result).toEqual([{ id: "task-1", title: "Ship task backend" }]);
  });

  it("creates a normalized task for a user", async () => {
    mockCreate.mockResolvedValue({
      toSafeObject: () => ({
        id: "task-1",
        title: "Ship task backend",
        topic: "Backend",
        dueDate: new Date("2026-07-20T00:00:00.000Z")
      })
    });

    const result = await createTask("user-1", {
      title: " Ship task backend ",
      type: "learning",
      priority: "high",
      dueDate: "2026-07-20T00:00:00.000Z",
      completed: false,
      topic: " Backend "
    });

    expect(mockCreate).toHaveBeenCalledWith({
      user: "user-1",
      title: "Ship task backend",
      type: "learning",
      priority: "high",
      dueDate: "2026-07-20T00:00:00.000Z",
      completed: false,
      topic: "Backend"
    });
    expect(result).toEqual({
      id: "task-1",
      title: "Ship task backend",
      topic: "Backend",
      dueDate: new Date("2026-07-20T00:00:00.000Z")
    });
  });

  it("gets only tasks owned by the user", async () => {
    mockFindOne.mockResolvedValue({
      toSafeObject: () => ({ id: "task-1", title: "Ship task backend" })
    });

    const result = await getTask("user-1", "task-1");

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "task-1", user: "user-1" });
    expect(result).toEqual({ id: "task-1", title: "Ship task backend" });
  });

  it("rejects missing tasks", async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(getTask("user-1", "missing-task")).rejects.toMatchObject({
      statusCode: 404,
      message: "Task not found."
    });
  });

  it("updates only tasks owned by the user", async () => {
    mockFindOneAndUpdate.mockResolvedValue({
      toSafeObject: () => ({ id: "task-1", completed: true, dueDate: null })
    });

    const result = await updateTask("user-1", "task-1", {
      completed: true,
      dueDate: ""
    });

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: "task-1", user: "user-1" },
      { completed: true, dueDate: null },
      { new: true, runValidators: true }
    );
    expect(result).toEqual({ id: "task-1", completed: true, dueDate: null });
  });

  it("deletes only tasks owned by the user", async () => {
    const deleteOne = vi.fn().mockResolvedValue();
    mockFindOne.mockResolvedValue({ deleteOne });

    await deleteTask("user-1", "task-1");

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "task-1", user: "user-1" });
    expect(deleteOne).toHaveBeenCalled();
  });
});
