/**
 * Test user configuration
 * ========================
 * Credentials are read from environment variables so they can differ between
 * environments (local dev, CI, staging) without changing test code.
 *
 * Playwright automatically loads `e2e/.env` before running tests, so copy
 * `.env.example` to `.env` and set your values there for local overrides.
 *
 * In CI, set the variables directly in the pipeline environment.
 */

export const TEST_USER = {
  username: process.env.TEST_USER_USERNAME ?? "alice",
  password: process.env.TEST_USER_PASSWORD ?? "password123",
};
