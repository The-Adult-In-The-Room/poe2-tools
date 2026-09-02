import { expect, test } from '@playwright/test'

test.describe('currency acceptance', () => {
  test('renders currency rows from the mock server', async ({ page }) => {
    await page.goto('/currency')

    await expect(page.getByTestId('market-currency')).toBeVisible()
    await expect(page.getByTestId('currency-table')).toBeVisible()

    const rows = page.getByTestId('currency-table').locator('tbody tr')
    await expect(rows).toHaveCount(2)

    const firstRow = rows.first()
    await expect(firstRow).toContainText('Chaos Orb')
    await expect(firstRow).toContainText('2k')

    const secondRow = rows.nth(1)
    await expect(secondRow).toContainText('Exalted Orb')
    await expect(secondRow).toContainText('1k')
  })

  test('updates the table when the reference currency changes', async ({ page }) => {
    await page.goto('/currency')

    await expect(page.getByTestId('currency-table').locator('tbody tr')).toHaveCount(2)

    const referenceSelector = page.getByTestId('reference-currency-selector')
    await referenceSelector.selectOption('chaos')

    await expect(page.getByTestId('currency-table').locator('tbody tr')).toHaveCount(1)
    await expect(page.getByTestId('currency-table').locator('tbody tr').first()).toContainText('Exalted Orb')
  })

  test('updates the URL and table when the league changes', async ({ page }) => {
    await page.goto('/currency')

    const leagueSelector = page.getByTestId('league-selector')
    await leagueSelector.selectOption('standard')

    await expect(page).toHaveURL(/league=standard/)
    await expect(page.getByTestId('currency-table')).toBeVisible()
    await expect(page.getByTestId('currency-table').locator('tbody tr')).toHaveCount(2)
  })

  test('updates the URL and table when the category changes', async ({ page }) => {
    await page.goto('/currency')

    await page.getByTestId('category-tabs').getByText('Fragments').click()

    await expect(page).toHaveURL(/type=Fragments/)
    await expect(page.getByTestId('currency-table')).toBeVisible()

    const rows = page.getByTestId('currency-table').locator('tbody tr')
    await expect(rows).toHaveCount(1)
    await expect(rows.first()).toContainText("Awakener's Orb Fragment")
  })
})
