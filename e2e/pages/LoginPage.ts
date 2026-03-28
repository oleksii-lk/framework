import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId("username-input");
    this.passwordInput = page.getByTestId("password-input");
    this.submitButton = page.getByTestId("submit-button");
    this.errorAlert = page.getByRole("alert");
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async goto() {
    await this.page.goto("/login");
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Fill in credentials and submit — the most common single action in tests. */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submit();
  }

  // ---------------------------------------------------------------------------
  // Assertions
  // ---------------------------------------------------------------------------

  // async expectToBeVisible() {
  //   await expect(this.page).toHaveURL(/\/login/);
  //   await expect(this.usernameInput).toBeVisible();
  //   await expect(this.passwordInput).toBeVisible();
  //   await expect(this.submitButton).toBeVisible();
  // }
  //
  // async expectErrorVisible(text?: string | RegExp) {
  //   await expect(this.errorAlert).toBeVisible();
  //   if (text !== undefined) {
  //     await expect(this.errorAlert).toContainText(text);
  //   }
  // }
  //
  // async expectNoError() {
  //   await expect(this.errorAlert).not.toBeVisible();
  // }
}
