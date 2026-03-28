/**
 * UNIT TESTS — src/api/auth.ts
 * ==============================
 * These tests verify our API client functions in isolation by mocking
 * the global fetch. No real network calls are made.
 *
 * Key technique: vi.stubGlobal("fetch", mockFn) replaces the real fetch
 * during the test and is restored automatically after each test.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { login, getMe, ApiError } from "../../api/auth";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a mock Response that fetch() would return. */
function mockResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("login()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the token data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({ access_token: "fake-jwt", token_type: "bearer" })
      )
    );

    const result = await login("alice", "password123");
    expect(result.access_token).toBe("fake-jwt");
    expect(result.token_type).toBe("bearer");
  });

  it("sends a POST request to /api/login", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockResponse({ access_token: "tok", token_type: "bearer" })
      );
    vi.stubGlobal("fetch", fetchMock);

    await login("alice", "password123");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/login"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("throws ApiError with status 401 on wrong credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({ detail: "Incorrect username or password" }, 401)
      )
    );

    await expect(login("alice", "wrong")).rejects.toThrow(ApiError);
    await expect(login("alice", "wrong")).rejects.toMatchObject({ status: 401 });
  });

  it("throws ApiError on unexpected server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ detail: "Internal error" }, 500))
    );

    await expect(login("alice", "password123")).rejects.toThrow(ApiError);
  });
});

describe("getMe()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns user data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({ username: "alice", full_name: "Alice Wonderland" })
      )
    );

    const user = await getMe("valid-token");
    expect(user.username).toBe("alice");
    expect(user.full_name).toBe("Alice Wonderland");
  });

  it("sends the token as a Bearer header", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        mockResponse({ username: "alice", full_name: "Alice Wonderland" })
      );
    vi.stubGlobal("fetch", fetchMock);

    await getMe("my-token");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-token",
        }),
      })
    );
  });

  it("throws ApiError on 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ detail: "Unauthorized" }, 401))
    );

    await expect(getMe("expired-token")).rejects.toThrow(ApiError);
    await expect(getMe("expired-token")).rejects.toMatchObject({ status: 401 });
  });
});
