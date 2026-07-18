import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFind = vi.fn();

vi.mock("../src/models/Task.js", () => ({
  Task: { find: mockFind }
}));

const { getUserStreakSummary } = await import("../src/services/streakService.js");

const NOW = new Date("2026-07-18T12:00:00.000Z");

describe("streak service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns an empty streak summary when the user has no completed task history", async () => {
    const select = vi.fn().mockResolvedValue([]);
    mockFind.mockReturnValue({ select });

    await expect(getUserStreakSummary("user-1", NOW)).resolves.toEqual({ currentStreak: 0, bestStreak: 0 });
    expect(mockFind).toHaveBeenCalledWith({ user: "user-1", completed: true, completedAt: { $ne: null } });
    expect(select).toHaveBeenCalledWith("completedAt");
  });

  it("uses only the requesting user's completed task timestamps", async () => {
    const select = vi.fn().mockResolvedValue([
      { completedAt: new Date("2026-07-17T09:00:00.000Z") },
      { completedAt: new Date("2026-07-18T09:00:00.000Z") }
    ]);
    mockFind.mockReturnValue({ select });

    await expect(getUserStreakSummary("user-1", NOW)).resolves.toEqual({ currentStreak: 2, bestStreak: 2 });
    expect(mockFind).toHaveBeenCalledWith({ user: "user-1", completed: true, completedAt: { $ne: null } });
  });
});