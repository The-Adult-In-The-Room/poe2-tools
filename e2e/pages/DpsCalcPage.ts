import type { Locator, Page } from '@playwright/test'

export class DpsCalcPage {
  readonly page: Page
  readonly container: Locator
  readonly pasteArea: Locator
  readonly itemName: Locator
  readonly totalDps: Locator
  readonly calculationResults: Locator
  readonly historyFab: Locator
  readonly calcHistory: Locator
  readonly pageTitle: Locator
  readonly clearFormButton: Locator

  constructor(page: Page) {
    this.page = page
    this.container = page.getByTestId('dpsCalc')
    this.pasteArea = page.getByTestId('pasteArea')
    this.itemName = page.getByTestId('itemName')
    this.totalDps = page.getByTestId('totalDps')
    this.calculationResults = page.getByTestId('calculationResults')
    this.historyFab = page.getByTestId('historyFab')
    this.calcHistory = page.getByTestId('calcHistory')
    this.pageTitle = page.getByText('Copy and Paste Entry')
    this.clearFormButton = page.getByRole('button', { name: 'Clear Form' })
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  async pasteItemText(text: string): Promise<void> {
    await this.pasteArea.fill(text)
  }

  dpsCard(testId: string): Locator {
    return this.page.getByTestId(testId)
  }

  async enterAttacksPerSecond(value: string): Promise<void> {
    await this.page.getByLabel('Attacks Per Second *', { exact: true }).fill(value)
  }

  async enterDamageRange(type: string, min: string, max: string): Promise<void> {
    await this.page.getByLabel(`${type} Min`, { exact: true }).fill(min)
    await this.page.getByLabel(`${type} Max`, { exact: true }).fill(max)
  }

  async clearPasteArea(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear', exact: true }).click()
  }

  async clearForm(): Promise<void> {
    await this.clearFormButton.click()
  }

  async openHistory(): Promise<void> {
    await this.historyFab.click()
  }
}
