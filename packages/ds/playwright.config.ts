import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:6006';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: 'npx http-server storybook-static --port 6006 --silent',
          url: baseURL,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
});
