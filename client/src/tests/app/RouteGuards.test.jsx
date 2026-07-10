import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute, PublicOnlyRoute } from "../../app/routeGuards";

const authState = {
  token: null,
  isInitializing: false,
  initialize: vi.fn()
};

vi.mock("../../store/useAuthStore", () => ({
  useAuthToken: () => authState.token,
  useAuthIsInitializing: () => authState.isInitializing,
  useAuthInitialize: () => authState.initialize
}));

describe("route guards", () => {
  beforeEach(() => {
    authState.token = null;
    authState.isInitializing = false;
    authState.initialize = vi.fn().mockResolvedValue(undefined);
  });

  it("redirects unauthenticated users away from protected routes", async () => {
    render(
      <MemoryRouter initialEntries={["/app"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<div>Protected page</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Login page")).toBeInTheDocument();
    });
  });

  it("renders protected content for authenticated users", async () => {
    authState.token = "token";

    render(
      <MemoryRouter initialEntries={["/app"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<div>Protected page</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Protected page")).toBeInTheDocument();
    });
    expect(authState.initialize).toHaveBeenCalledTimes(1);
  });

  it("redirects authenticated users away from auth screens", async () => {
    authState.token = "token";

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<div>Login page</div>} />
          </Route>
          <Route path="/app" element={<div>App home</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("App home")).toBeInTheDocument();
    });
  });
});
