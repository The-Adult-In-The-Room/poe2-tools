import { test as base, chromium } from '@playwright/test'
import { CurrencyPage } from '../pages/CurrencyPage'
import { DpsCalcPage } from '../pages/DpsCalcPage'
import { Navigation } from '../pages/Navigation'
import { SeoPage } from '../pages/SeoPage'
import { LIGHTPANDA_WS_ENDPOINT } from './lightpanda'

export * from '@playwright/test'

export const test = base.extend<{
  currencyPage: CurrencyPage
  dpsCalcPage: DpsCalcPage
  navigation: Navigation
  seoPage: SeoPage
}>({
  browser: async (
    // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature requires object destructuring.
    {},
    use,
  ) => {
    const browser = await chromium.connectOverCDP(LIGHTPANDA_WS_ENDPOINT)
    await use(browser)
    await browser.close()
  },
  currencyPage: async ({ page }, use) => {
    await use(new CurrencyPage(page))
  },
  dpsCalcPage: async ({ page }, use) => {
    await use(new DpsCalcPage(page))
  },
  navigation: async ({ page }, use) => {
    await use(new Navigation(page))
  },
  seoPage: async ({ page }, use) => {
    await use(new SeoPage(page))
  },
})
