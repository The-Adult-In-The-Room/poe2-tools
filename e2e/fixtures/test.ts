import { test as base } from '@playwright/test'
import { CurrencyPage } from '../pages/CurrencyPage'
import { DpsCalcPage } from '../pages/DpsCalcPage'
import { Navigation } from '../pages/Navigation'
import { SeoPage } from '../pages/SeoPage'

export * from '@playwright/test'

export const test = base.extend<{
  currencyPage: CurrencyPage
  dpsCalcPage: DpsCalcPage
  navigation: Navigation
  seoPage: SeoPage
}>({
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
