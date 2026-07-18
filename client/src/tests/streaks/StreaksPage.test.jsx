import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StreaksPage } from "../../features/streaks/pages/StreaksPage";

const fetchStreakSummaryRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();
vi.mock("../../features/streaks/api/streaksApi", () => ({ fetchStreakSummaryRequest: (...args) => fetchStreakSummaryRequestMock(...args) }));
vi.mock("../../store/useAuthStore", () => ({ useAuthToken: () => useAuthTokenMock() }));
const renderPage = () => render(<MemoryRouter><StreaksPage /></MemoryRouter>);

describe("StreaksPage", () => {
  beforeEach(() => { vi.clearAllMocks(); useAuthTokenMock.mockReturnValue("token-123"); fetchStreakSummaryRequestMock.mockResolvedValue({ streak: { currentStreak: 0, bestStreak: 0 } }); });
  it("shows loading before an empty summary", async () => { let resolve; fetchStreakSummaryRequestMock.mockReturnValue(new Promise((result) => { resolve = result; })); renderPage(); expect(screen.getByLabelText(/streaks loading state/i)).toBeInTheDocument(); resolve({ streak: { currentStreak: 0, bestStreak: 0 } }); expect(await screen.findByText(/no qualifying days yet/i)).toBeInTheDocument(); });
  it("retries a failed summary request", async () => { const user=userEvent.setup(); fetchStreakSummaryRequestMock.mockRejectedValueOnce(new Error("Service unavailable.")).mockResolvedValueOnce({ streak: { currentStreak: 0, bestStreak: 0 } }); renderPage(); expect(await screen.findByText(/consistency summary is unavailable/i)).toBeInTheDocument(); await user.click(screen.getByRole("button", { name: /retry/i })); await waitFor(() => expect(fetchStreakSummaryRequestMock).toHaveBeenCalledTimes(2)); expect(await screen.findByText(/no qualifying days yet/i)).toBeInTheDocument(); });
  it("renders current and best streak values", async () => { fetchStreakSummaryRequestMock.mockResolvedValue({ streak: { currentStreak: 2, bestStreak: 5 } }); renderPage(); expect(await screen.findByText("Current streak")).toBeInTheDocument(); expect(screen.getByText("Best streak")).toBeInTheDocument(); expect(screen.getByText("2")).toBeInTheDocument(); expect(screen.getByText("5")).toBeInTheDocument(); expect(fetchStreakSummaryRequestMock).toHaveBeenCalledWith("token-123"); });
});