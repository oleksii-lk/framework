import { defineConfig, devices } from "@playwright/test";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const API_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

export default defineConfig({
  testDir: "./tests",
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Reporter to use
  reporter: "html",
  use: {
    // Base URL of the running frontend app
    baseURL: FRONTEND_URL,
    // Screenshot on failure — saved to test-results/<test-name>/
    screenshot: "only-on-failure",
    // Video on failure — useful alongside screenshots for understanding timing
    video: "retain-on-failure",
    // Full trace on first retry: DOM snapshots, network, console logs
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Automatically start both servers before running tests
  webServer: [
    {
      command: "cd ../backend && uvicorn app.main:app --port 8000",
      port: parseInt(new URL(API_URL).port || "8000"),
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd ../frontend && npm run dev",
      port: parseInt(new URL(FRONTEND_URL).port || "5173"),
      reuseExistingServer: !process.env.CI,
    },
  ],
});
