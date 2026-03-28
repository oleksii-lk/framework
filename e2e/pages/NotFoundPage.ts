import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NotFoundPage extends BasePage {
  readonly heading: Locator;
  readonly goHomeLink: Locator;

  constructor(page: Page) {
    super(page, "/404");
    this.heading = page.getByTestId("not-found-heading");
    this.goHomeLink = page.getByTestId("go-home-link");
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async clickGoHome() {
    await this.goHomeLink.click();
  }

  // ---------------------------------------------------------------------------
  // Assertions
  // ---------------------------------------------------------------------------

  // async expectToBeVisible() {
  //   await expect(this.heading).toBeVisible();
  //   await expect(this.goHomeLink).toBeVisible();
  // }
  //
  // async expectPathDisplayed(path: string) {
  //   await expect(this.page.getByText(path)).toBeVisible();
  // }
}
