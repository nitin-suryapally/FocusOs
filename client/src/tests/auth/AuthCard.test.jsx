import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthCard } from "../../features/auth/components/AuthCard";

const useAuthStoreMock = vi.fn();
const navigateMock = vi.fn();
const markRegistrationOnboardingPendingMock = vi.fn();

vi.mock("../../features/onboarding/onboardingStorage", () => ({ markRegistrationOnboardingPending: (...args) => markRegistrationOnboardingPendingMock(...args) }));

vi.mock("../../features/auth/store/useAuthStore", () => ({
  useAuthStore: (selector) => useAuthStoreMock(selector),
  useAuthRegister: () => useAuthStoreMock((state) => state.register),
  useAuthLogin: () => useAuthStoreMock((state) => state.login),
  useAuthIsLoading: () => useAuthStoreMock((state) => state.isLoading),
  useAuthError: () => useAuthStoreMock((state) => state.error),
  useAuthClearError: () => useAuthStoreMock((state) => state.clearError)
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

describe("AuthCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the register form and shows the full name field", () => {
    useAuthStoreMock.mockImplementation((selector) =>
      selector({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: false,
        error: null,
        clearError: vi.fn()
      })
    );

    render(
      <MemoryRouter>
        <AuthCard mode="register" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("submits login credentials and navigates to the app on success", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn().mockResolvedValue({
      token: "token",
      user: { id: "1", email: "alex@example.com" }
    });

    useAuthStoreMock.mockImplementation((selector) =>
      selector({
        register: vi.fn(),
        login: loginMock,
        isLoading: false,
        error: null,
        clearError: vi.fn()
      })
    );

    render(
      <MemoryRouter>
        <AuthCard mode="login" />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith({
      email: "alex@example.com",
      password: "password123"
    });
    expect(navigateMock).toHaveBeenCalledWith("/app");
  });

  it("marks onboarding pending only after registration succeeds", async () => {
    const user = userEvent.setup();
    const registerMock = vi.fn().mockResolvedValue({ token: "token", user: { id: "user-1" } });
    useAuthStoreMock.mockImplementation((selector) => selector({ register: registerMock, login: vi.fn(), isLoading: false, error: null, clearError: vi.fn() }));
    render(<MemoryRouter><AuthCard mode="register" /></MemoryRouter>);
    await user.type(screen.getByLabelText(/full name/i), "Alex");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => expect(markRegistrationOnboardingPendingMock).toHaveBeenCalledWith("user-1"));
    expect(navigateMock).toHaveBeenCalledWith("/app");
  });
  it("shows client-side validation errors before submitting", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn();

    useAuthStoreMock.mockImplementation((selector) =>
      selector({
        register: vi.fn(),
        login: loginMock,
        isLoading: false,
        error: null,
        clearError: vi.fn()
      })
    );

    render(
      <MemoryRouter>
        <AuthCard mode="login" />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });
});
