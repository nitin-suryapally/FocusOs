import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";
const getDashboard = vi.fn();
vi.mock("../src/services/dashboardService.js", () => ({ getDashboard }));
const verify = vi.fn();
vi.mock("jsonwebtoken", async () => { const actual = await vi.importActual("jsonwebtoken"); return { ...actual, default: { ...actual.default, verify }, verify }; });
const { createApp } = await import("../src/app.js");
const app = createApp();

describe("dashboard routes", () => {
  beforeEach(() => { vi.clearAllMocks(); verify.mockReturnValue({ sub: "user-1" }); });

  it("rejects an unauthenticated dashboard request", async () => {
    expect((await request(app).get("/api/dashboard")).status).toBe(401);
    expect(getDashboard).not.toHaveBeenCalled();
  });

  it("returns the authenticated user's dashboard", async () => {
    getDashboard.mockResolvedValue({ summary: { tasks: { openCount: 1 } }, upcoming: [], recentActivity: [] });
    const response = await request(app).get("/api/dashboard").set("Authorization", "Bearer token");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ summary: { tasks: { openCount: 1 } }, upcoming: [], recentActivity: [] });
    expect(getDashboard).toHaveBeenCalledWith("user-1");
  });
});