import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppLayout } from "../../layouts/AppLayout";

const authState = {
  user: { name: "Alex Carter", email: "alex@example.com" },
  logout: vi.fn()
};

vi.mock("../../store/useAuthStore", () => ({
  useAuthUser: () => authState.user,
  useAuthLogout: () => authState.logout
}));

describe("AppLayout", () => {
  beforeEach(() => {
    authState.logout = vi.fn();
  });

  it("opens and closes the mobile navigation menu", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/app"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<div>Overview content</div>} />
            <Route path="/app/tasks" element={<div>Tasks content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText("Focus AI")).toHaveLength(2);

    const menu = screen.getByLabelText("Workspace navigation");
    const openButton = screen.getByRole("button", { name: /open navigation menu/i });

    expect(menu).toHaveClass("overflow-hidden");
    const navigation = screen.getByRole("navigation", { name: "Primary workspace navigation" });
    expect(navigation.parentElement).toHaveClass("flex-1", "overflow-y-auto");
    expect(screen.getByRole("button", { name: "Sign out" })).toHaveClass("shrink-0");

    expect(menu).toHaveAttribute("data-state", "closed");

    await user.click(openButton);
    expect(menu).toHaveAttribute("data-state", "open");
    expect(openButton).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: /tasks/i }));
    expect(menu).toHaveAttribute("data-state", "closed");
    expect(screen.getByText("Tasks content")).toBeInTheDocument();
  });
});
