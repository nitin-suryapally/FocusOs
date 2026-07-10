import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

const mockFindOne = vi.fn();
const mockCreate = vi.fn();
const mockFindById = vi.fn();

vi.mock("../src/models/User.js", () => ({
  User: {
    findOne: mockFindOne,
    create: mockCreate,
    findById: mockFindById
  }
}));

const signMock = vi.fn();

vi.mock("jsonwebtoken", async () => {
  const actual = await vi.importActual("jsonwebtoken");

  return {
    ...actual,
    default: {
      ...actual.default,
      sign: signMock
    },
    sign: signMock
  };
});

const { ApiError } = await import("../src/utils/ApiError.js");
const { createAuthToken, getUserById, loginUser, registerUser } = await import(
  "../src/services/authService.js"
);

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates JWT access tokens with the configured secret", () => {
    signMock.mockReturnValue("signed-token");

    const token = createAuthToken("user-123");

    expect(token).toBe("signed-token");
    expect(signMock).toHaveBeenCalledWith({ sub: "user-123" }, "test-secret", {
      expiresIn: "7d"
    });
  });

  it("rejects duplicate registrations", async () => {
    mockFindOne.mockResolvedValue({ _id: "existing-user" });

    await expect(
      registerUser({
        name: "Alex",
        email: "alex@example.com",
        password: "password123"
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "An account with this email already exists."
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("registers a new user with a normalized email", async () => {
    mockFindOne.mockResolvedValue(null);
    signMock.mockReturnValue("signed-token");
    mockCreate.mockResolvedValue({
      _id: "user-1",
      toSafeObject: () => ({
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      })
    });

    const result = await registerUser({
      name: " Alex ",
      email: " Alex@Example.com ",
      password: "password123"
    });

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Alex",
      email: "alex@example.com",
      password: "password123"
    });
    expect(result).toEqual({
      token: "signed-token",
      user: {
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      }
    });
  });

  it("rejects invalid login attempts", async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(
      loginUser({
        email: "alex@example.com",
        password: "password123"
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("returns a token and safe user payload for valid login", async () => {
    signMock.mockReturnValue("signed-token");
    mockFindOne.mockResolvedValue({
      _id: "user-1",
      comparePassword: vi.fn().mockResolvedValue(true),
      toSafeObject: () => ({
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      })
    });

    const result = await loginUser({
      email: "alex@example.com",
      password: "password123"
    });

    expect(result).toEqual({
      token: "signed-token",
      user: {
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      }
    });
  });

  it("loads the current user by id", async () => {
    mockFindById.mockResolvedValue({
      toSafeObject: () => ({
        id: "user-1",
        name: "Alex",
        email: "alex@example.com"
      })
    });

    const result = await getUserById("user-1");

    expect(result).toEqual({
      id: "user-1",
      name: "Alex",
      email: "alex@example.com"
    });
  });
});
