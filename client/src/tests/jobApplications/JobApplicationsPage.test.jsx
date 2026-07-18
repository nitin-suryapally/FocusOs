import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobApplicationsPage } from "../../features/jobApplications/pages/JobApplicationsPage";

const fetchJobApplicationsRequestMock = vi.fn();
const createJobApplicationRequestMock = vi.fn();
const updateJobApplicationRequestMock = vi.fn();
const deleteJobApplicationRequestMock = vi.fn();
const useAuthTokenMock = vi.fn();
vi.mock("../../features/jobApplications/api/jobApplicationsApi", () => ({ fetchJobApplicationsRequest: (...args) => fetchJobApplicationsRequestMock(...args), createJobApplicationRequest: (...args) => createJobApplicationRequestMock(...args), updateJobApplicationRequest: (...args) => updateJobApplicationRequestMock(...args), deleteJobApplicationRequest: (...args) => deleteJobApplicationRequestMock(...args) }));
vi.mock("../../store/useAuthStore", () => ({ useAuthToken: () => useAuthTokenMock() }));
const renderPage = () => render(<MemoryRouter><JobApplicationsPage /></MemoryRouter>);

describe("JobApplicationsPage", () => {
  beforeEach(() => { vi.clearAllMocks(); useAuthTokenMock.mockReturnValue("token-123"); fetchJobApplicationsRequestMock.mockResolvedValue({ applications: [] }); });

  it("shows loading before the empty state", async () => {
    let resolveRequest;
    fetchJobApplicationsRequestMock.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    renderPage();
    expect(screen.getByLabelText(/job applications loading state/i)).toBeInTheDocument();
    resolveRequest({ applications: [] });
    expect(await screen.findByText(/no job applications yet/i)).toBeInTheDocument();
  });

  it("retries a failed request", async () => {
    const user = userEvent.setup();
    fetchJobApplicationsRequestMock.mockRejectedValueOnce(new Error("Service unavailable.")).mockResolvedValueOnce({ applications: [] });
    renderPage();
    expect(await screen.findByText(/job pipeline is unavailable/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() => expect(fetchJobApplicationsRequestMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/no job applications yet/i)).toBeInTheDocument();
  });

  it("renders loaded applications as focused pipeline cards", async () => {
    fetchJobApplicationsRequestMock.mockResolvedValue({ applications: [{ id: "application-1", company: "Focus AI", role: "Product engineer", status: "interviewing", followUpDate: "2026-07-21T00:00:00.000Z", notes: "Prepare the portfolio walkthrough." }, { id: "application-2", company: "OpenAI", role: "Frontend engineer", status: "applied", followUpDate: null, notes: "" }] });
    renderPage();
    expect(await screen.findByRole("heading", { name: "Focus AI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "OpenAI" })).toBeInTheDocument();
    expect(screen.getByText("Product engineer")).toBeInTheDocument();
    expect(screen.getAllByText("interviewing").length).toBeGreaterThan(0);
    expect(screen.getByText(/not scheduled/i)).toBeInTheDocument();
    expect(screen.getByText(/prepare the portfolio walkthrough/i)).toBeInTheDocument();
    expect(fetchJobApplicationsRequestMock).toHaveBeenCalledWith("token-123");
  });  it("creates an application through the modal", async () => { const user=userEvent.setup(); createJobApplicationRequestMock.mockResolvedValue({application:{id:"application-3",company:"Focus AI",role:"Engineer",status:"applied",followUpDate:null,notes:""}}); renderPage(); await screen.findByText(/no job applications yet/i); await user.click(screen.getByRole("button",{name:/add application/i})); const dialog=screen.getByRole("dialog",{name:/capture the opportunity/i}); await user.type(within(dialog).getByLabelText(/company/i),"Focus AI"); await user.type(within(dialog).getByLabelText(/^role$/i),"Engineer"); await user.selectOptions(within(dialog).getByLabelText(/status/i),"applied"); await user.click(within(dialog).getByRole("button",{name:/save application/i})); await waitFor(()=>expect(createJobApplicationRequestMock).toHaveBeenCalledWith("token-123",expect.objectContaining({company:"Focus AI",role:"Engineer",status:"applied"}))); expect(await screen.findByRole("heading",{name:"Focus AI"})).toBeInTheDocument(); });
  it("edits an application through the reused modal", async () => { const user=userEvent.setup(); fetchJobApplicationsRequestMock.mockResolvedValue({applications:[{id:"application-1",company:"Focus AI",role:"Product engineer",status:"saved",followUpDate:null,notes:"Drafted outreach.",applicationUrl:""}]}); updateJobApplicationRequestMock.mockResolvedValue({application:{id:"application-1",company:"Focus AI",role:"Senior product engineer",status:"interviewing",followUpDate:null,notes:"Portfolio walkthrough scheduled.",applicationUrl:""}}); renderPage(); await screen.findByRole("heading",{name:"Focus AI"}); await user.click(screen.getByRole("button",{name:/edit application/i})); const dialog=screen.getByRole("dialog",{name:/update the opportunity/i}); await user.clear(within(dialog).getByLabelText(/^role$/i)); await user.type(within(dialog).getByLabelText(/^role$/i),"Senior product engineer"); await user.selectOptions(within(dialog).getByLabelText(/status/i),"interviewing"); await user.clear(within(dialog).getByLabelText(/notes/i)); await user.type(within(dialog).getByLabelText(/notes/i),"Portfolio walkthrough scheduled."); await user.click(within(dialog).getByRole("button",{name:/update application/i})); await waitFor(()=>expect(updateJobApplicationRequestMock).toHaveBeenCalledWith("token-123","application-1",expect.objectContaining({role:"Senior product engineer",status:"interviewing",notes:"Portfolio walkthrough scheduled."}))); expect(await screen.findByText("Senior product engineer")).toBeInTheDocument(); expect(screen.getByText("Portfolio walkthrough scheduled.")).toBeInTheDocument(); });
  it("confirms and removes a job application", async () => { const user=userEvent.setup(); fetchJobApplicationsRequestMock.mockResolvedValue({applications:[{id:"application-1",company:"Focus AI",role:"Product engineer",status:"saved",followUpDate:null,notes:""}]}); deleteJobApplicationRequestMock.mockResolvedValue({message:"Job application deleted."}); renderPage(); await screen.findByRole("heading",{name:"Focus AI"}); await user.click(screen.getByRole("button",{name:/delete application/i})); const dialog=screen.getByRole("dialog",{name:/delete job application/i}); expect(deleteJobApplicationRequestMock).not.toHaveBeenCalled(); await user.click(within(dialog).getByRole("button",{name:/delete application/i})); await waitFor(()=>expect(deleteJobApplicationRequestMock).toHaveBeenCalledWith("token-123","application-1")); expect(await screen.findByText(/no job applications yet/i)).toBeInTheDocument(); });
  it("updates an application status from its card", async () => { const user=userEvent.setup(); fetchJobApplicationsRequestMock.mockResolvedValue({applications:[{id:"application-1",company:"Focus AI",role:"Product engineer",status:"saved",followUpDate:null,notes:""}]}); updateJobApplicationRequestMock.mockResolvedValue({application:{id:"application-1",company:"Focus AI",role:"Product engineer",status:"applied",followUpDate:null,notes:""}}); renderPage(); await screen.findByRole("heading",{name:"Focus AI"}); await user.selectOptions(screen.getByLabelText("Status for Focus AI"),"applied"); await waitFor(()=>expect(updateJobApplicationRequestMock).toHaveBeenCalledWith("token-123","application-1",{status:"applied"})); expect(screen.getByLabelText("Status for Focus AI")).toHaveValue("applied"); });

  it("filters statuses and sorts scheduled follow-ups before unscheduled applications", async () => { const user=userEvent.setup(); fetchJobApplicationsRequestMock.mockResolvedValue({applications:[{id:"application-1",company:"Later Co",role:"Engineer",status:"applied",followUpDate:"2026-07-30T00:00:00.000Z",notes:""},{id:"application-2",company:"Earlier Co",role:"Designer",status:"interviewing",followUpDate:"2026-07-21T00:00:00.000Z",notes:""},{id:"application-3",company:"No Date Co",role:"Writer",status:"applied",followUpDate:null,notes:""}]}); renderPage(); const earlier=await screen.findByRole("heading",{name:"Earlier Co"}); const later=screen.getByRole("heading",{name:"Later Co"}); const noDate=screen.getByRole("heading",{name:"No Date Co"}); expect(earlier.compareDocumentPosition(later)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy(); expect(later.compareDocumentPosition(noDate)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy(); await user.selectOptions(screen.getByLabelText(/^status$/i),"applied"); expect(screen.getByRole("heading",{name:"Later Co"})).toBeInTheDocument(); expect(screen.getByRole("heading",{name:"No Date Co"})).toBeInTheDocument(); expect(screen.queryByRole("heading",{name:"Earlier Co"})).not.toBeInTheDocument(); });
});