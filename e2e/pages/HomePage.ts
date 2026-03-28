import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly signInLink: Locator;
  readonly dashboardLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.heading = page.getByRole("heading", { level: 1 });
    this.signInLink = page.getByTestId("go-to-login-link");
    this.dashboardLink = page.getByTestId("go-to-dashboard-link");
    this.logoutButton = page.getByTestId("home-logout-button");
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async clickSignIn() {
    await this.signInLink.click();
  }

  async clickGoToDashboard() {
    await this.dashboardLink.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
