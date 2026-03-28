/**
 * E2E TESTS — Dashboard
 * ======================
 * These tests use API authentication (bypass the login form) because the
 * feature under test is the dashboard, not the login page.
 *
 * Welcome message content and unauthorized-redirect behaviour are covered
 * at a lower level:
 *  - DashboardPage.test.tsx (Vitest) — component renders full_name, redirects
 *    on missing/invalid token, clears sessionStorage on 401
 *  - useAuth.test.tsx (Vitest) — logout clears token and sessionStorage
 *  - test_api.py (pytest)   — /api/me returns 401 for bad/missing tokens
 */

import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { apiLogin } from "../api/authApi";
import { TEST_USER } from "../config/users";

test.describe("Dashboard", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page, request }) => {
    const { access_token } = await apiLogin(request, TEST_USER.username, TEST_USER.password);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.loginWithToken(access_token);
  });

  test("logout redirects to home", async ({ page }) => {
    await expect(dashboardPage.logoutButton).toBeVisible();
    await dashboardPage.logout();
    await expect(page).toHaveURL("/");
  });
});
