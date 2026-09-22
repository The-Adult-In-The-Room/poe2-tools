import { defineConfig } from '@playwright/test'
import { MOCK_POE_NINJA_BASE } from './fixtures/mockPoeNinjaConfig'

process.env.USE_MOCK_POE_NINJA = 'true'
process.env.POE_NINJA_BASE = MOCK_POE_NINJA_BASE

const PORT = Number(process.env.PORT || 3000)
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 3 : undefined,
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
      name: 'acceptance',
      testDir: './acceptance',
    },
    {
      name: 'shared-navigation',
      testDir: './shared-tests',
      testMatch: /navigation\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: BASE_URL,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'ignore',
    env: {
      POE_NINJA_BASE: MOCK_POE_NINJA_BASE,
    },
  },
})
