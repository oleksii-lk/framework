/**
 * COMPONENT TESTS — DashboardPage
 * =================================
 *  - Renders the welcome message with the user's full name
 *  - Redirects to "/" when there is no token
 *  - Redirects to "/" and clears the token when /api/me returns 401
 *
 * Mocking:
 *  - useAuth
 *  - getMe
 *  - useNavigate
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardPage } from "../../pages/DashboardPage";
import * as authApi from "../../api/auth";
import * as useAuthModule from "../../hooks/useAuth";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importActual) => ({
  ...(await importActual<typeof import("react-router-dom")>()),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../api/auth", () => ({
  getMe: vi.fn(),
  // Keep the real ApiError shape so instanceof checks in the component work
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = "ApiError";
    }
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
}

/** Return a realistic useAuth shape with optional overrides. */
function mockAuth(overrides: Partial<ReturnType<typeof useAuthModule.useAuth>> = {}) {
  vi.mocked(useAuthModule.useAuth).mockReturnValue({
    token: "fake-token",
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DashboardPage", () => {
  describe("when authenticated", () => {
    it("renders the welcome message with the user's full name", async () => {
      mockAuth({ token: "tok" });
      vi.mocked(authApi.getMe).mockResolvedValue({
        username: "alice",
        full_name: "Alice Wonderland",
      });

      renderDashboard();

      await screen.findByText(/Alice Wonderland/);
      expect(screen.getByTestId("welcome-message")).toHaveTextContent("Alice Wonderland");
    });

    it("renders the correct full name for a different user", async () => {
      mockAuth({ token: "tok" });
      vi.mocked(authApi.getMe).mockResolvedValue({
        username: "bob",
        full_name: "Bob Builder",
      });

      renderDashboard();

      await screen.findByText(/Bob Builder/);
    });

    it("shows the logout button", async () => {
      mockAuth({ token: "tok" });
      vi.mocked(authApi.getMe).mockResolvedValue({
        username: "alice",
        full_name: "Alice Wonderland",
      });

      renderDashboard();

      // Wait for loading to finish
      await screen.findByTestId("logout-button");
      expect(screen.getByTestId("logout-button")).toBeVisible();
    });
  });

  describe("when unauthenticated", () => {
    it("redirects to home when there is no token", () => {
      mockAuth({ token: null, isAuthenticated: false });

      renderDashboard();

      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    it("redirects to home when /api/me returns 401", async () => {
      const mockLogout = vi.fn();
      mockAuth({ token: "expired-tok", logout: mockLogout });
      vi.mocked(authApi.getMe).mockRejectedValue(
        new authApi.ApiError(401, "Unauthorized")
      );

      renderDashboard();

      // Wait for the effect to run and the error to be caught
      await vi.waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });

    it("calls logout when /api/me returns 401", async () => {
      const mockLogout = vi.fn();
      mockAuth({ token: "expired-tok", logout: mockLogout });
      vi.mocked(authApi.getMe).mockRejectedValue(
        new authApi.ApiError(401, "Unauthorized")
      );

      renderDashboard();

      await vi.waitFor(() => {
        expect(mockLogout).toHaveBeenCalledOnce();
      });
    });
  });
});
