import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobApplicationDetailPage } from "../../features/jobApplications/pages/JobApplicationDetailPage";

const fetchJobApplicationRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();

vi.mock("../../features/jobApplications/api/jobApplicationsApi", () => ({ fetchJobApplicationRequest: (...args) => fetchJobApplicationRequestMock(...args) }));
vi.mock("../../store/useAuthStore", () => ({ useAuthToken: () => useAuthTokenMock() }));

const application = { id: "application-1", company: "Focus AI", role: "Product engineer", status: "interviewing", applicationUrl: "https://example.com/jobs/1", followUpDate: "2026-07-21T00:00:00.000Z", notes: "Prepare the portfolio walkthrough.", createdAt: "2026-07-18T00:00:00.000Z", updatedAt: "2026-07-19T00:00:00.000Z" };
const renderPage = () => render(<MemoryRouter initialEntries={["/app/applications/application-1"]}><Routes><Route path="/app/applications" element={<p>Applications list</p>} /><Route path="/app/applications/:applicationId" element={<JobApplicationDetailPage />} /></Routes></MemoryRouter>);

describe("JobApplicationDetailPage", () => {
  beforeEach(() => { vi.clearAllMocks(); useAuthTokenMock.mockReturnValue("token-123"); fetchJobApplicationRequestMock.mockResolvedValue({ application }); });

  it("loads the application details and lifecycle history", async () => {
    renderPage();
    expect(screen.getByLabelText(/job application loading state/i)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Focus AI" })).toBeInTheDocument();
    expect(screen.getByText("Product engineer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open application/i })).toHaveAttribute("href", "https://example.com/jobs/1");
    expect(screen.getByText(/prepare the portfolio walkthrough/i)).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(fetchJobApplicationRequestMock).toHaveBeenCalledWith("token-123", "application-1");
  });

  it("retries a failed detail request", async () => {
    const user = userEvent.setup();
    fetchJobApplicationRequestMock.mockRejectedValueOnce(new Error("Service unavailable.")).mockResolvedValueOnce({ application });
    renderPage();
    expect(await screen.findByText(/could not load job application/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() => expect(fetchJobApplicationRequestMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("heading", { name: "Focus AI" })).toBeInTheDocument();
  });
});