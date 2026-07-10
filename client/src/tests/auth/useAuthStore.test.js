import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../../store/useAuthStore";
import * as authApi from "../../features/auth/api/authApi";

vi.mock("../../features/auth/api/authApi", () => ({
  fetchCurrentUserRequest: vi.fn(),
  loginRequest: vi.fn(),
  logoutRequest: vi.fn(),
  registerRequest: vi.fn()
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isInitializing: false,
      error: null
    });
    vi.clearAllMocks();
  });

  it("persists registration responses", async () => {
    authApi.registerRequest.mockResolvedValue({
      token: "register-token",
      user: { id: "1", name: "Alex", email: "alex@example.com" }
    });

    await useAuthStore.getState().register({
      name: "Alex",
      email: "alex@example.com",
      password: "password123"
    });

    expect(useAuthStore.getState().token).toBe("register-token");
    expect(JSON.parse(window.localStorage.getItem("focus-ai-auth"))).toEqual({
      token: "register-token",
      user: { id: "1", name: "Alex", email: "alex@example.com" }
    });
  });

  it("stores API errors when login fails", async () => {
    authApi.loginRequest.mockRejectedValue(new Error("Invalid email or password."));

    await expect(
      useAuthStore.getState().login({
        email: "alex@example.com",
        password: "bad-password"
      })
    ).rejects.toThrow("Invalid email or password.");

    expect(useAuthStore.getState().error).toBe("Invalid email or password.");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("hydrates the persisted session from the current-user endpoint", async () => {
    window.localStorage.setItem(
      "focus-ai-auth",
      JSON.stringify({
        token: "token",
        user: { id: "stale", email: "stale@example.com" }
      })
    );

    useAuthStore.setState({
      token: "token",
      user: { id: "stale", email: "stale@example.com" },
      isLoading: false,
      isInitializing: false,
      error: null
    });

    authApi.fetchCurrentUserRequest.mockResolvedValue({
      user: { id: "1", name: "Alex", email: "alex@example.com" }
    });

    await useAuthStore.getState().initialize();

    expect(authApi.fetchCurrentUserRequest).toHaveBeenCalledWith("token");
    expect(useAuthStore.getState().user).toEqual({
      id: "1",
      name: "Alex",
      email: "alex@example.com"
    });
    expect(JSON.parse(window.localStorage.getItem("focus-ai-auth"))).toEqual({
      token: "token",
      user: { id: "1", name: "Alex", email: "alex@example.com" }
    });
  });

  it("clears auth state on logout", async () => {
    window.localStorage.setItem(
      "focus-ai-auth",
      JSON.stringify({
        token: "token",
        user: { id: "1", email: "alex@example.com" }
      })
    );

    useAuthStore.setState({
      token: "token",
      user: { id: "1", email: "alex@example.com" },
      isLoading: false,
      isInitializing: false,
      error: null
    });

    authApi.logoutRequest.mockResolvedValue({ message: "Logout successful." });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(window.localStorage.getItem("focus-ai-auth")).toBeNull();
  });
});
