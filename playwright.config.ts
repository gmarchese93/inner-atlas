import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;
const webServerEnv = {
  PORT: String(port),
  BASE_PATH: "/",
  ...(process.env.ESBUILD_BINARY_PATH
    ? { ESBUILD_BINARY_PATH: process.env.ESBUILD_BINARY_PATH }
    : {}),
  ...(process.env.NODE_PATH ? { NODE_PATH: process.env.NODE_PATH } : {}),
};

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "pnpm --filter @workspace/inner-atlas dev",
    env: webServerEnv,
    url: baseURL,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120_000,
  },
});
