/**
 * E2E TESTS — Login flow
 * =======================
 * These tests cover user journeys that genuinely require the full stack:
 * real browser → React form → HTTP → FastAPI → back.
 *
 * What is NOT tested here (covered at lower levels instead):
 *  - Login form rendering and loading state  → LoginForm.test.tsx (Vitest)
 *  - useAuth error/success state transitions → useAuth.test.tsx (Vitest)
 *  - API returning 401 for bad credentials  → test_api.py (pytest)
 *  - Second user (bob) can also log in      → test_api.py (pytest)
 */

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TEST_USER } from "../config/users";

// ---------------------------------------------------------------------------
// Successful path — full UI login flow
// ---------------------------------------------------------------------------
test.describe("Login", () => {
  test("logs in and redirects to dashboard", async ({page}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.username, TEST_USER.password);

    await expect(page).toHaveURL(dashboardPage.path);
  });

// ---------------------------------------------------------------------------
// Failure path — wrong credentials
// ---------------------------------------------------------------------------
  test("shows an error and stays on the login page for wrong credentials", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.username, "definitelywrongpassword");

    await expect(loginPage.errorAlert).toContainText(/Invalid/);
    await expect(page).toHaveURL(/\/login/);
  });


// ---------------------------------------------------------------------------
// Protected route — unauthenticated access
// ---------------------------------------------------------------------------
  test("redirects unauthenticated users from /dashboard to home", async ({page}) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(page).toHaveURL("/");
  });


// ---------------------------------------------------------------------------
// Logout — full UI flow
// ---------------------------------------------------------------------------
  test("logging out from the dashboard returns to home", async ({page}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(TEST_USER.username, TEST_USER.password);
    await dashboardPage.logout();

    await expect(page).toHaveURL("/");
  });
});