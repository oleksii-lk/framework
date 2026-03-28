/**
 * Base page object
 * =================
 * Holds state and behaviour that every page object shares:
 *  - the Playwright Page instance
 *  - the URL path for this page
 *  - goto() navigation
 *
 * Child classes call super(page, "/their-path") and get these for free,
 * then only define the locators and actions specific to their own page.
 */

import { type Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page, path: string) {
    this.page = page;
    this.path = path;
  }

  /**
   * Inject a JWT into sessionStorage and navigate to this page.
   *
   * Why navigate to "/" first instead of directly to this.path?
   * sessionStorage is origin-bound, so we need to be on the app origin before
   * calling page.evaluate(). Using "/" is the safest choice because it is a
   * stable page with no redirects — navigating directly to a protected route
   * like "/dashboard" triggers a React redirect to "/" (no token yet), which
   * creates a race condition between loginWithToken returning and the page
   * settling into its final state. Starting from "/" avoids the double
   * navigation entirely.
   */
  async loginWithToken(token: string) {
    await this.page.goto("/");
    await this.page.evaluate(
      (t) => sessionStorage.setItem("auth_token", t),
      token
    );
    await this.goto();
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
