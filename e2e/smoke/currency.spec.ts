import { expect, test } from '@playwright/test'

test.describe('currency smoke', () => {
  test('loads the market currency page without errors', async ({ page }) => {
    await page.goto('/currency')

    await expect(page.getByTestId('market-currency')).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)
    await expect(page.getByTestId('currency-table')).toBeVisible()
    await expect(page.getByTestId('currency-table').locator('tbody tr').first()).toBeVisible()
  })
})
