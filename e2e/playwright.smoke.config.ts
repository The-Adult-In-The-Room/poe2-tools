import { defineConfig } from '@playwright/test'

process.env.USE_MOCK_POE_NINJA = 'false'
delete process.env.POE_NINJA_BASE

const PORT = Number(process.env.PORT || 3000)
const BASE_URL = `http://localhost:${PORT}`

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
  webServer: {
    command: 'npm run preview',
    url: BASE_URL,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'ignore',
  },
})
