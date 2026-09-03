import type { Locator, Page } from '@playwright/test'

export class Navigation {
  readonly dpsCalcLink: Locator
  readonly marketCurrencyLink: Locator

  constructor(page: Page) {
    this.dpsCalcLink = page.getByText('Weapon DPS Calculator')
    this.marketCurrencyLink = page.getByText('Market Currency')
  }

  async toDpsCalc(): Promise<void> {
    await this.dpsCalcLink.click()
  }

  async toMarketCurrency(): Promise<void> {
    await this.marketCurrencyLink.click()
  }
}
