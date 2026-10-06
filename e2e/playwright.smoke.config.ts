import { defineConfig } from '@playwright/test'

process.env.USE_MOCK_POE_NINJA = 'false'
delete process.env.POE_NINJA_BASE

if (!process.env.SMOKE_BASE_URL) {
  throw new Error(
    'SMOKE_BASE_URL is required for smoke tests. Set it to the deployed URL, e.g. https://example.up.railway.app',
  )
}

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : 'list',
  globalSetup: './fixtures/globalSetup.ts',
  globalTeardown: './fixtures/globalTeardown.ts',
  use: {
    baseURL: process.env.SMOKE_BASE_URL,
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'smoke',
      testDir: './smoke',
    },
    {
      name: 'shared-seo',
      testDir: './shared-tests',
      testMatch: /seo\.spec\.ts/,
    },
  ],
})
