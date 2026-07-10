import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

const mockRegisterUser = vi.fn();
const mockLoginUser = vi.fn();
const mockGetUserById = vi.fn();

vi.mock("../src/services/authService.js", () => ({
  registerUser: mockRegisterUser,
  loginUser: mockLoginUser,
  getUserById: mockGetUserById
}));

const mockVerify = vi.fn();

vi.mock("jsonwebtoken", async () => {
  const actual = await vi.importActual("jsonwebtoken");

  return {
    ...actual,
    default: {
      ...actual.default,
      verify: mockVerify
    },
    verify: mockVerify
  };
});

const { createApp } = await import("../src/app.js");

describe("auth routes", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user and returns a safe auth payload", async () => {
    mockRegisterUser.mockResolvedValue({
      token: "jwt-token",
      user: {
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      }
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Alex",
      email: "alex@example.com",
      password: "password123"
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Registration successful.",
      token: "jwt-token",
      user: {
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      }
    });
    expect(mockRegisterUser).toHaveBeenCalledWith({
      name: "Alex",
      email: "alex@example.com",
      password: "password123"
    });
  });

  it("rejects invalid registration payloads before service execution", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "",
      email: "invalid-email",
      password: "short"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name is required.");
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("logs a user in", async () => {
    mockLoginUser.mockResolvedValue({
      token: "login-token",
      user: {
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      }
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "alex@example.com",
      password: "password123"
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful.");
    expect(response.body.token).toBe("login-token");
    expect(mockLoginUser).toHaveBeenCalledWith({
      email: "alex@example.com",
      password: "password123"
    });
  });

  it("rejects missing auth headers on protected routes", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });

  it("returns the current authenticated user", async () => {
    mockVerify.mockReturnValue({ sub: "user-1" });
    mockGetUserById.mockResolvedValue({
      id: "user-1",
      name: "Alex",
      email: "alex@example.com"
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      }
    });
    expect(mockGetUserById).toHaveBeenCalledWith("user-1");
  });

  it("returns a stateless logout response", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Logout successful."
    });
  });
});
