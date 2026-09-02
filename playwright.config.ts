import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT || 3000)
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'dot' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 15000,
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
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
