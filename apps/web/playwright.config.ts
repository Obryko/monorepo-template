import { defineConfig, devices } from '@playwright/test'
import { playwrightEnv } from './playwright.env'

const port = playwrightEnv.E2E_WEB_PORT
const baseURL = playwrightEnv.E2E_BASE_URL ?? `http://127.0.0.1:${port}`
const isCI = Boolean(playwrightEnv.CI)

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html']] : [['list'], ['html']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  ...(isCI
    ? {
        workers: 1,
      }
    : {}),
  ...(playwrightEnv.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command: `pnpm exec vite dev --host 127.0.0.1 --port ${port}`,
          url: baseURL,
          reuseExistingServer: !isCI,
          timeout: 120_000,
        },
      }),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
