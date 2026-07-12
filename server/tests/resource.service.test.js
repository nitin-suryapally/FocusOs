import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFind = vi.fn();
const mockCreate = vi.fn();
const mockFindOne = vi.fn();
const mockFindOneAndUpdate = vi.fn();

vi.mock("../src/models/Resource.js", () => ({
  Resource: {
    find: mockFind,
    create: mockCreate,
    findOne: mockFindOne,
    findOneAndUpdate: mockFindOneAndUpdate
  }
}));

const {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource
} = await import("../src/services/resourceService.js");

describe("resource service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists resources scoped to a user", async () => {
    const sortMock = vi.fn().mockResolvedValue([
      {
        toSafeObject: () => ({ id: "resource-1", title: "React Patterns" })
      }
    ]);
    mockFind.mockReturnValue({ sort: sortMock });

    const result = await listResources("user-1");

    expect(mockFind).toHaveBeenCalledWith({ user: "user-1" });
    expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(result).toEqual([{ id: "resource-1", title: "React Patterns" }]);
  });

  it("creates a normalized resource for a user", async () => {
    mockCreate.mockResolvedValue({
      toSafeObject: () => ({
        id: "resource-1",
        title: "React Patterns",
        topic: "React",
        tags: ["hooks"]
      })
    });

    const result = await createResource("user-1", {
      title: " React Patterns ",
      topic: " React ",
      type: "article",
      status: "saved",
      url: " https://example.com/react ",
      tags: [" hooks ", "hooks", ""],
      notes: " Read carefully "
    });

    expect(mockCreate).toHaveBeenCalledWith({
      user: "user-1",
      title: "React Patterns",
      topic: "React",
      type: "article",
      status: "saved",
      url: "https://example.com/react",
      tags: ["hooks"],
      notes: "Read carefully"
    });
    expect(result).toEqual({
      id: "resource-1",
      title: "React Patterns",
      topic: "React",
      tags: ["hooks"]
    });
  });

  it("gets only resources owned by the user", async () => {
    mockFindOne.mockResolvedValue({
      toSafeObject: () => ({ id: "resource-1", title: "React Patterns" })
    });

    const result = await getResource("user-1", "resource-1");

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "resource-1", user: "user-1" });
    expect(result).toEqual({ id: "resource-1", title: "React Patterns" });
  });

  it("rejects missing resources", async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(getResource("user-1", "missing-resource")).rejects.toMatchObject({
      statusCode: 404,
      message: "Resource not found."
    });
  });

  it("updates only resources owned by the user", async () => {
    mockFindOneAndUpdate.mockResolvedValue({
      toSafeObject: () => ({ id: "resource-1", status: "completed" })
    });

    const result = await updateResource("user-1", "resource-1", {
      status: "completed",
      tags: [" react ", "javascript"]
    });

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: "resource-1", user: "user-1" },
      { status: "completed", tags: ["react", "javascript"] },
      { new: true, runValidators: true }
    );
    expect(result).toEqual({ id: "resource-1", status: "completed" });
  });

  it("deletes only resources owned by the user", async () => {
    const deleteOne = vi.fn().mockResolvedValue();
    mockFindOne.mockResolvedValue({ deleteOne });

    await deleteResource("user-1", "resource-1");

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "resource-1", user: "user-1" });
    expect(deleteOne).toHaveBeenCalled();
  });
});
