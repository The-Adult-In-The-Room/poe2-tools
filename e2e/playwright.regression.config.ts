import { defineConfig } from '@playwright/test'

const BASE_URL = process.env.REGRESSION_BASE_URL ?? 'https://poe2-tools.up.railway.app/'

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : 'list',
  globalSetup: './fixtures/globalSetup.ts',
  globalTeardown: './fixtures/globalTeardown.ts',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'regression',
      testDir: './regression',
    },
    {
      name: 'shared-seo',
      testDir: './shared-tests',
      testMatch: /seo\.spec\.ts/,
    },
    {
      name: 'shared-navigation',
      testDir: './shared-tests',
      testMatch: /navigation\.spec\.ts/,
    },
  ],
})
