import { beforeEach, describe, expect, it, vi } from "vitest";

const taskFind = vi.fn(), resourceFind = vi.fn(), ideaFind = vi.fn(), applicationFind = vi.fn();
vi.mock("../src/models/Task.js", () => ({ Task: { find: taskFind } }));
vi.mock("../src/models/Resource.js", () => ({ Resource: { find: resourceFind } }));
vi.mock("../src/models/ProjectIdea.js", () => ({ ProjectIdea: { find: ideaFind } }));
vi.mock("../src/models/JobApplication.js", () => ({ JobApplication: { find: applicationFind } }));
const getUserStreakSummary = vi.fn();
vi.mock("../src/services/streakService.js", () => ({ getUserStreakSummary }));
const { getDashboard } = await import("../src/services/dashboardService.js");

const queryFor = (records) => ({ select: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(records) }) });
const record = (id, values) => ({ _id: id, ...values });

describe("dashboard service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    taskFind.mockReturnValue(queryFor([])); resourceFind.mockReturnValue(queryFor([])); ideaFind.mockReturnValue(queryFor([])); applicationFind.mockReturnValue(queryFor([]));
    getUserStreakSummary.mockResolvedValue({ currentStreak: 0, bestStreak: 0 });
  });

  it("builds the documented summary, upcoming items, and recent activity", async () => {
    taskFind.mockReturnValue(queryFor([
      record("task-today", { title: "Today", priority: "high", completed: false, dueDate: "2026-07-19T10:00:00.000Z", updatedAt: "2026-07-18T10:00:00.000Z" }),
      record("task-overdue", { title: "Overdue", priority: "low", completed: false, dueDate: "2026-07-18T10:00:00.000Z", updatedAt: "2026-07-17T10:00:00.000Z" }),
      record("task-upcoming", { title: "Upcoming", priority: "medium", completed: false, dueDate: "2026-07-20T10:00:00.000Z", updatedAt: "2026-07-19T11:00:00.000Z" }),
      record("task-done", { title: "Done", priority: "medium", completed: true, dueDate: null, updatedAt: "2026-07-19T12:00:00.000Z" })
    ]));
    resourceFind.mockReturnValue(queryFor([record("resource-1", { title: "Resource", status: "in_progress", updatedAt: "2026-07-19T13:00:00.000Z" })]));
    ideaFind.mockReturnValue(queryFor([record("idea-1", { title: "Idea", status: "planned", updatedAt: "2026-07-19T14:00:00.000Z" }), record("idea-complete", { title: "Complete", status: "completed", updatedAt: "2026-07-16T14:00:00.000Z" })]));
    applicationFind.mockReturnValue(queryFor([
      record("application-due", { company: "Acme", role: "Engineer", status: "interviewing", followUpDate: "2026-07-19T15:00:00.000Z", updatedAt: "2026-07-19T15:00:00.000Z" }),
      record("application-upcoming", { company: "Beta", role: "Designer", status: "applied", followUpDate: "2026-07-20T10:00:00.000Z", updatedAt: "2026-07-19T16:00:00.000Z" }),
      record("application-rejected", { company: "Gamma", role: "Writer", status: "rejected", followUpDate: "2026-07-20T10:00:00.000Z", updatedAt: "2026-07-19T17:00:00.000Z" })
    ]));
    getUserStreakSummary.mockResolvedValue({ currentStreak: 2, bestStreak: 5 });

    const dashboard = await getDashboard("user-1", new Date("2026-07-19T09:00:00.000Z"));

    expect(dashboard.summary).toEqual({ tasks: { openCount: 3, dueTodayCount: 1, overdueCount: 1 }, resources: { totalCount: 1, inProgressCount: 1 }, streak: { currentStreak: 2, bestStreak: 5 }, projectIdeas: { activeCount: 1 }, jobApplications: { activeCount: 2, followUpDueCount: 1 } });
    expect(dashboard.upcoming).toEqual([
      { kind: "jobApplicationFollowUp", id: "application-upcoming", title: "Beta - Designer", date: "2026-07-20T10:00:00.000Z", status: "applied" },
      { kind: "task", id: "task-upcoming", title: "Upcoming", date: "2026-07-20T10:00:00.000Z", priority: "medium" }
    ]);
    expect(dashboard.recentActivity[0]).toEqual({ kind: "jobApplication", id: "application-rejected", title: "Gamma - Writer", updatedAt: "2026-07-19T17:00:00.000Z" });
  });

  it("scopes every source to the user and returns empty lists", async () => {
    const now = new Date("2026-07-19T09:00:00.000Z");
    await expect(getDashboard("user-1", now)).resolves.toMatchObject({ upcoming: [], recentActivity: [] });
    [taskFind, resourceFind, ideaFind, applicationFind].forEach((find) => expect(find).toHaveBeenCalledWith({ user: "user-1" }));
    expect(getUserStreakSummary).toHaveBeenCalledWith("user-1", now);
  });
});