import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

const mockListResources = vi.fn();
const mockCreateResource = vi.fn();
const mockGetResource = vi.fn();
const mockUpdateResource = vi.fn();
const mockDeleteResource = vi.fn();

vi.mock("../src/services/resourceService.js", () => ({
  listResources: mockListResources,
  createResource: mockCreateResource,
  getResource: mockGetResource,
  updateResource: mockUpdateResource,
  deleteResource: mockDeleteResource
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

describe("resource routes", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockVerify.mockReturnValue({ sub: "user-1" });
  });

  it("rejects unauthenticated resource requests", async () => {
    const response = await request(app).get("/api/resources");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
    expect(mockListResources).not.toHaveBeenCalled();
  });

  it("lists resources for the authenticated user", async () => {
    mockListResources.mockResolvedValue([{ id: "resource-1", title: "React Patterns" }]);

    const response = await request(app)
      .get("/api/resources")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      resources: [{ id: "resource-1", title: "React Patterns" }]
    });
    expect(mockListResources).toHaveBeenCalledWith("user-1");
  });

  it("creates a resource for the authenticated user", async () => {
    mockCreateResource.mockResolvedValue({
      id: "resource-1",
      title: "React Patterns",
      topic: "React"
    });

    const payload = {
      title: "React Patterns",
      topic: "React",
      type: "article",
      status: "saved",
      url: "https://example.com/react",
      tags: ["hooks"],
      notes: "Read this week"
    };

    const response = await request(app)
      .post("/api/resources")
      .set("Authorization", "Bearer valid-token")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Resource created.",
      resource: {
        id: "resource-1",
        title: "React Patterns",
        topic: "React"
      }
    });
    expect(mockCreateResource).toHaveBeenCalledWith("user-1", payload);
  });

  it("rejects invalid resource create payloads before service execution", async () => {
    const response = await request(app)
      .post("/api/resources")
      .set("Authorization", "Bearer valid-token")
      .send({
        title: "",
        topic: "React"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title is required.");
    expect(mockCreateResource).not.toHaveBeenCalled();
  });

  it("gets one owned resource", async () => {
    mockGetResource.mockResolvedValue({
      id: "resource-1",
      title: "React Patterns"
    });

    const response = await request(app)
      .get("/api/resources/resource-1")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      resource: {
        id: "resource-1",
        title: "React Patterns"
      }
    });
    expect(mockGetResource).toHaveBeenCalledWith("user-1", "resource-1");
  });

  it("updates one owned resource", async () => {
    mockUpdateResource.mockResolvedValue({
      id: "resource-1",
      status: "completed"
    });

    const response = await request(app)
      .patch("/api/resources/resource-1")
      .set("Authorization", "Bearer valid-token")
      .send({ status: "completed" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Resource updated.",
      resource: {
        id: "resource-1",
        status: "completed"
      }
    });
    expect(mockUpdateResource).toHaveBeenCalledWith("user-1", "resource-1", {
      status: "completed"
    });
  });

  it("rejects empty resource updates", async () => {
    const response = await request(app)
      .patch("/api/resources/resource-1")
      .set("Authorization", "Bearer valid-token")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("At least one resource field is required.");
    expect(mockUpdateResource).not.toHaveBeenCalled();
  });

  it("deletes one owned resource", async () => {
    mockDeleteResource.mockResolvedValue();

    const response = await request(app)
      .delete("/api/resources/resource-1")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Resource deleted."
    });
    expect(mockDeleteResource).toHaveBeenCalledWith("user-1", "resource-1");
  });
});
