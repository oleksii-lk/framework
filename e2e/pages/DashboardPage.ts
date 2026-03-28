import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";


export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page, "/dashboard");
    this.welcomeMessage = page.getByTestId("welcome-message");
    this.logoutButton = page.getByTestId("logout-button");
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async logout() {
    await this.logoutButton.click();
  }

  // ---------------------------------------------------------------------------
  // Assertions
  // ---------------------------------------------------------------------------

  // async expectToBeVisible() {
  //   await expect(this.page).toHaveURL(/\/dashboard/);
  //   await expect(this.logoutButton).toBeVisible();
  // }
  //
  // async expectWelcomeMessage(fullName: string) {
  //   await expect(this.welcomeMessage).toContainText(fullName);
  // }
}
