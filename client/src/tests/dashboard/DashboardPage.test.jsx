import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";

const fetchDashboardRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();
vi.mock("../../features/dashboard/api/dashboardApi", () => ({ fetchDashboardRequest: (...args) => fetchDashboardRequestMock(...args) }));
vi.mock("../../store/useAuthStore", () => ({ useAuthToken: () => useAuthTokenMock() }));
const emptyDashboard = { summary: { tasks: { openCount: 0, dueTodayCount: 0, overdueCount: 0 }, resources: { totalCount: 0, inProgressCount: 0 }, streak: { currentStreak: 0, bestStreak: 0 }, projectIdeas: { activeCount: 0 }, jobApplications: { activeCount: 0, followUpDueCount: 0 } }, upcoming: [], recentActivity: [] };
const renderPage = () => render(<MemoryRouter><DashboardPage /></MemoryRouter>);

describe("DashboardPage", () => {
  beforeEach(() => { vi.clearAllMocks(); useAuthTokenMock.mockReturnValue("token-123"); fetchDashboardRequestMock.mockResolvedValue(emptyDashboard); });
  it("shows loading before the empty dashboard state", async () => { let resolve; fetchDashboardRequestMock.mockReturnValue(new Promise((result) => { resolve = result; })); renderPage(); expect(screen.getByLabelText(/dashboard loading state/i)).toBeInTheDocument(); resolve(emptyDashboard); expect(await screen.findByText(/dashboard has no activity yet/i)).toBeInTheDocument(); });
  it("retries a failed dashboard request", async () => { const user = userEvent.setup(); fetchDashboardRequestMock.mockRejectedValueOnce(new Error("Service unavailable.")).mockResolvedValueOnce(emptyDashboard); renderPage(); expect(await screen.findByText(/workspace overview is unavailable/i)).toBeInTheDocument(); await user.click(screen.getByRole("button", { name: /retry/i })); await waitFor(() => expect(fetchDashboardRequestMock).toHaveBeenCalledTimes(2)); expect(await screen.findByText(/dashboard has no activity yet/i)).toBeInTheDocument(); });
  it("renders the summary, upcoming work, and recent activity", async () => { fetchDashboardRequestMock.mockResolvedValue({ summary: { tasks: { openCount: 3, dueTodayCount: 1, overdueCount: 1 }, resources: { totalCount: 2, inProgressCount: 1 }, streak: { currentStreak: 2, bestStreak: 5 }, projectIdeas: { activeCount: 1 }, jobApplications: { activeCount: 2, followUpDueCount: 1 } }, upcoming: [{ kind: "task", id: "task-1", title: "Finish portfolio", date: "2026-07-20T00:00:00.000Z", priority: "high" }], recentActivity: [{ kind: "resource", id: "resource-1", title: "React guide", updatedAt: "2026-07-19T00:00:00.000Z" }] }); renderPage(); expect(await screen.findByText("Open tasks")).toBeInTheDocument(); expect(screen.getByText("3")).toBeInTheDocument(); expect(screen.getByText("Finish portfolio")).toBeInTheDocument(); expect(screen.getByText("React guide")).toBeInTheDocument(); expect(fetchDashboardRequestMock).toHaveBeenCalledWith("token-123"); });
  it("keeps summary cards visible when activity sections are empty", async () => { fetchDashboardRequestMock.mockResolvedValue({ ...emptyDashboard, summary: { ...emptyDashboard.summary, tasks: { openCount: 1, dueTodayCount: 0, overdueCount: 0 } } }); renderPage(); expect(await screen.findByText("Open tasks")).toBeInTheDocument(); expect(screen.getByText(/no upcoming work is scheduled/i)).toBeInTheDocument(); expect(screen.getByText(/no recent activity yet/i)).toBeInTheDocument(); });
});