/**
 * UNIT TESTS — useAuth hook
 * ==========================
 * Hook tests use renderHook() from @testing-library/react.
 * We mock the api/auth module so no real HTTP calls are made.
 *
 * Key concept: hooks tests sit between pure unit tests and component tests —
 * they test stateful logic without rendering any UI.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth } from "../../hooks/useAuth";
import * as authApi from "../../api/auth";

// Mock the api/auth module.
//
// Why a factory function instead of just vi.mock("../../api/auth")?
// Auto-mocking replaces exports with stubs, but doesn't guarantee that
// functions become vi.fn() — especially when the module also exports a class.
// The factory lets us be explicit: functions become vi.fn(), and ApiError
// stays as the real class so `instanceof` checks in useAuth still work.
vi.mock("../../api/auth", () => ({
  login: vi.fn(),
  getMe: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = "ApiError";
    }
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    // Reset sessionStorage before each test for a clean slate
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe("initial state", () => {
    it("starts unauthenticated when no token in sessionStorage", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });

    it("starts authenticated if a token exists in sessionStorage", () => {
      sessionStorage.setItem("auth_token", "existing-token");
      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("has no error initially", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.error).toBeNull();
    });

    it("is not loading initially", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isLoading).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // login()
  // ---------------------------------------------------------------------------

  describe("login()", () => {
    it("sets isAuthenticated to true on success", async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        access_token: "new-token",
        token_type: "bearer",
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login("alice", "password123");
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("stores the token in sessionStorage on success", async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        access_token: "stored-token",
        token_type: "bearer",
      });

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login("alice", "password123");
      });

      expect(sessionStorage.getItem("auth_token")).toBe("stored-token");
    });

    it("sets error message on 401", async () => {
      vi.mocked(authApi.login).mockRejectedValue(
        new authApi.ApiError(401, "Incorrect username or password")
      );

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login("alice", "wrong");
      });

      expect(result.current.error).toBe("Invalid username or password");
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("sets a generic error on unexpected failures", async () => {
      vi.mocked(authApi.login).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login("alice", "password123");
      });

      expect(result.current.error).toMatch(/something went wrong/i);
    });

    it("resets isLoading to false after login completes", async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        access_token: "tok",
        token_type: "bearer",
      });

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login("alice", "password123");
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // logout()
  // ---------------------------------------------------------------------------

  describe("logout()", () => {
    it("clears the token", async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        access_token: "tok",
        token_type: "bearer",
      });

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.login("alice", "password123");
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });

    it("removes the token from sessionStorage", () => {
      sessionStorage.setItem("auth_token", "some-token");
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });
  });
});
