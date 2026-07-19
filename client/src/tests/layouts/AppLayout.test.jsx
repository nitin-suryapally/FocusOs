import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppLayout } from "../../layouts/AppLayout";
import { markRegistrationOnboardingPending } from "../../features/onboarding/onboardingStorage";

const useAuthUserMock = vi.fn();
const useAuthLogoutMock = vi.fn();
vi.mock("../../store/useAuthStore", () => ({ useAuthUser: () => useAuthUserMock(), useAuthLogout: () => useAuthLogoutMock() }));
vi.mock("../../components/AppNavigation", () => ({ AppNavigation: () => <nav>Navigation</nav> }));

describe("AppLayout onboarding", () => {
  beforeEach(() => { window.sessionStorage.clear(); vi.clearAllMocks(); useAuthUserMock.mockReturnValue({ id: "user-1", name: "Alex" }); useAuthLogoutMock.mockReturnValue(vi.fn()); });
  it("shows the deck only for a pending registration walkthrough", async () => {
    markRegistrationOnboardingPending("user-1");
    render(<MemoryRouter><AppLayout /></MemoryRouter>);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
  it("does not show the deck for normal authenticated sessions", () => {
    render(<MemoryRouter><AppLayout /></MemoryRouter>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("closes the mobile navigation when Escape is pressed", () => {
    render(<MemoryRouter><AppLayout /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    expect(screen.getByLabelText("Workspace navigation")).toHaveAttribute("data-state", "open");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByLabelText("Workspace navigation")).toHaveAttribute("data-state", "closed");
  });
});