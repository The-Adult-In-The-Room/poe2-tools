import type { Locator, Page } from '@playwright/test'

export class CurrencyPage {
  readonly page: Page
  readonly container: Locator
  readonly pageTitle: Locator
  readonly table: Locator
  readonly rows: Locator
  readonly leagueSelector: Locator
  readonly referenceSelector: Locator
  readonly categoryTabs: Locator
  readonly errorAlert: Locator

  constructor(page: Page) {
    this.page = page
    this.container = page.getByTestId('market-currency')
    this.pageTitle = page.getByText('Market Currency Rates')
    this.table = page.getByTestId('currency-table')
    this.rows = this.table.locator('tbody tr')
    this.leagueSelector = page.getByTestId('league-selector')
    this.referenceSelector = page.getByTestId('reference-currency-selector')
    this.categoryTabs = page.getByTestId('category-tabs')
    this.errorAlert = page.getByRole('alert')
  }

  async goto(query = ''): Promise<void> {
    await this.page.goto(`/currency${query}`)
  }

  async selectLeague(value: string): Promise<void> {
    await this.leagueSelector.selectOption(value)
    // Lightpanda doesn't always fire change events from selectOption.
    await this.leagueSelector.evaluate((element) => {
      element.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  async selectReferenceCurrency(value: string): Promise<void> {
    await this.referenceSelector.selectOption(value)
    // Lightpanda doesn't always fire change events from selectOption.
    await this.referenceSelector.evaluate((element) => {
      element.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  async selectCategory(name: string): Promise<void> {
    await this.categoryTabs.getByText(name).click()
  }

  row(index: number): Locator {
    return this.rows.nth(index)
  }

  rowName(index: number): Locator {
    return this.row(index).locator('td').first()
  }

  rowVolume(index: number): Locator {
    return this.row(index).locator('[data-testid="currency-volume"]')
  }

  rowValueLeft(index: number): Locator {
    return this.row(index).locator('[data-testid="currency-value-left"]')
  }

  rowValueRight(index: number): Locator {
    return this.row(index).locator('[data-testid="currency-value-right"]')
  }
}
