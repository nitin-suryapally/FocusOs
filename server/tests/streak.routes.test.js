import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

const mockGetUserStreakSummary = vi.fn();
vi.mock("../src/services/streakService.js", () => ({ getUserStreakSummary: mockGetUserStreakSummary }));

const mockVerify = vi.fn();
vi.mock("jsonwebtoken", async () => {
  const actual = await vi.importActual("jsonwebtoken");
  return { ...actual, default: { ...actual.default, verify: mockVerify }, verify: mockVerify };
});

const { createApp } = await import("../src/app.js");

describe("streak routes", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mockVerify.mockReturnValue({ sub: "user-1" });
  });

  it("rejects unauthenticated summary requests", async () => {
    const response = await request(app).get("/api/streaks/summary");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
    expect(mockGetUserStreakSummary).not.toHaveBeenCalled();
  });

  it("returns the authenticated user's streak summary", async () => {
    mockGetUserStreakSummary.mockResolvedValue({ currentStreak: 2, bestStreak: 5 });

    const response = await request(app).get("/api/streaks/summary").set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ streak: { currentStreak: 2, bestStreak: 5 } });
    expect(mockGetUserStreakSummary).toHaveBeenCalledWith("user-1");
  });
});