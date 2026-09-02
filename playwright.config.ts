import { defineConfig, devices } from '@playwright/test'
import { MOCK_POE_NINJA_BASE } from './e2e/fixtures/mockPoeNinjaConfig'

const USE_MOCK = process.env.USE_MOCK_POE_NINJA === 'true'

if (USE_MOCK) {
  process.env.POE_NINJA_BASE = MOCK_POE_NINJA_BASE
}

const PORT = Number(process.env.PORT || 3000)
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  fullyParallel: USE_MOCK,
  workers: USE_MOCK ? (process.env.CI ? 3 : undefined) : 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : 'list',
  globalSetup: USE_MOCK ? './e2e/fixtures/globalSetup.ts' : undefined,
  globalTeardown: USE_MOCK ? './e2e/fixtures/globalTeardown.ts' : undefined,
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
      testDir: './e2e/smoke',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'acceptance',
      testDir: './e2e/acceptance',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: BASE_URL,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    env: USE_MOCK
      ? {
          POE_NINJA_BASE: MOCK_POE_NINJA_BASE,
        }
      : undefined,
  },
})
