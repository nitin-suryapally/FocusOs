import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../../components/FormField";
import { AppNavigation } from "../../components/AppNavigation";
import { MemoryRouter } from "react-router-dom";

const stateModules = [
  {
    label: "Dashboard",
    loading: () => import("../../features/dashboard/components/DashboardLoadingState").then(({ DashboardLoadingState }) => DashboardLoadingState),
    error: () => import("../../features/dashboard/components/DashboardErrorState").then(({ DashboardErrorState }) => DashboardErrorState)
  },
  {
    label: "Resources",
    loading: () => import("../../features/resources/components/ResourcesLoadingState").then(({ ResourcesLoadingState }) => ResourcesLoadingState),
    error: () => import("../../features/resources/components/ResourcesErrorState").then(({ ResourcesErrorState }) => ResourcesErrorState)
  },
  {
    label: "Tasks",
    loading: () => import("../../features/tasks/components/TasksLoadingState").then(({ TasksLoadingState }) => TasksLoadingState),
    error: () => import("../../features/tasks/components/TasksErrorState").then(({ TasksErrorState }) => TasksErrorState)
  },
  {
    label: "Streaks",
    loading: () => import("../../features/streaks/components/StreaksLoadingState").then(({ StreaksLoadingState }) => StreaksLoadingState),
    error: () => import("../../features/streaks/components/StreaksErrorState").then(({ StreaksErrorState }) => StreaksErrorState)
  },
  {
    label: "Project ideas",
    loading: () => import("../../features/projectIdeas/components/ProjectIdeasLoadingState").then(({ ProjectIdeasLoadingState }) => ProjectIdeasLoadingState),
    error: () => import("../../features/projectIdeas/components/ProjectIdeasErrorState").then(({ ProjectIdeasErrorState }) => ProjectIdeasErrorState)
  },
  {
    label: "Job applications",
    loading: () => import("../../features/jobApplications/components/JobApplicationsLoadingState").then(({ JobApplicationsLoadingState }) => JobApplicationsLoadingState),
    error: () => import("../../features/jobApplications/components/JobApplicationsErrorState").then(({ JobApplicationsErrorState }) => JobApplicationsErrorState)
  }
];

describe("shared client accessibility contracts", () => {
  it("associates a field error with its input and announces it", () => {
    render(<FormField id="email" label="Email" value="" onChange={vi.fn()} error="Email is required." />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required.");
  });

  it("labels the primary navigation landmark", () => {
    render(<MemoryRouter><AppNavigation onNavigate={vi.fn()} /></MemoryRouter>);

    expect(screen.getByRole("navigation", { name: "Primary workspace navigation" })).toBeInTheDocument();
  });

  it.each(stateModules)("keeps $label loading and error feedback accessible", async ({ loading, error }) => {
    const LoadingState = await loading();
    const ErrorState = await error();
    const onRetry = vi.fn();
    const { rerender } = render(<LoadingState />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");

    rerender(<ErrorState error="Request failed." onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Request failed.");

    await userEvent.setup().click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});