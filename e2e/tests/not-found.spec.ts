/**
 * E2E TESTS — 404 page
 * =====================
 * Two things are worth testing at the e2e level:
 *  1. The app actually renders the 404 page for unknown routes (not a blank
 *     screen or an unhandled error) — requires a real browser + React Router.
 *  2. The "go home" link works — real navigation.
 *
 * Displaying the unmatched path string is a pure rendering detail; it's
 * covered by a Vitest component test where it can run in milliseconds.
 */

import { test, expect } from "@playwright/test";
import { NotFoundPage } from "../pages/NotFoundPage";

test.describe("Not-found-page", () => {
  test("Route to 404 page for an unknown route", async ({page}) => {
    const notFoundPage = new NotFoundPage(page);
    await page.goto("/this-does-not-exist");
    await expect(notFoundPage.heading).toBeVisible();
    await notFoundPage.clickGoHome();
    await expect(page).toHaveURL("/");
  });
});