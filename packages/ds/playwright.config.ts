import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:6006';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /.*-mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      testMatch: /.*-mobile\.spec\.ts/,
      // hasTouch is what makes (pointer: coarse) and (hover: none) match;
      // isMobile alone does not.
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
  ...(process.env.CI || process.env.E2E_BASE_URL
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
