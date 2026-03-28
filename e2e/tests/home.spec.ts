/**
 * E2E TESTS — Home page
 * ======================
 * The home page has a small piece of auth-aware UI: it shows different
 * content depending on whether the user is logged in. This is worth one
 * e2e test because it involves real sessionStorage state in a real browser.
 *
 * Navigation to /login and /dashboard is covered by login.spec.ts.
 * The 404 page is covered by not-found.spec.ts.
 */

import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { apiLogin } from "../api/authApi";
import { TEST_USER } from "../config/users";

test("shows dashboard link and logout button when authenticated", async ({ page, request }) => {
  const homePage = new HomePage(page);
  const { access_token } = await apiLogin(request, TEST_USER.username, TEST_USER.password);
  await homePage.loginWithToken(access_token);

  await expect(homePage.dashboardLink).toBeVisible();
  await expect(homePage.logoutButton).toBeVisible();
});
