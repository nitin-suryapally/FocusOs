import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRequest } from "../../features/auth/api/authApi";

describe("authApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the registration token and user from the response body", async () => {
    const responsePayload = {
      token: "register-token",
      user: { id: "1", name: "Alex", email: "alex@example.com" }
    };

    const jsonMock = vi.fn().mockResolvedValue(responsePayload);
    const fetchMock = vi.spyOn(window, "fetch").mockResolvedValue({
      ok: true,
      json: jsonMock
    });

    const result = await registerRequest({
      name: "Alex",
      email: "alex@example.com",
      password: "password123"
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Alex",
        email: "alex@example.com",
        password: "password123"
      })
    });
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(responsePayload);
  });
});