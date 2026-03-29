import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      // What to report: terminal summary + browsable HTML + lcov for CI tools
      reporter: ["text", "html", "lcov"],
      // Output folder for the HTML report
      reportsDirectory: "./coverage-report",
      // Only measure coverage on our source files, not tests or config
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/tests/**",
        "src/main.tsx",      // just mounts the app, nothing to test
        "src/App.tsx",       // just routes, covered by e2e
      ],
      // Fail the run if coverage drops below these thresholds
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
