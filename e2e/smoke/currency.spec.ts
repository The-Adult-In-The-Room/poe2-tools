import { expect, test } from '../fixtures/test'

test.describe('currency smoke', () => {
  test('loads the market currency page without errors', async ({ currencyPage }) => {
    await currencyPage.goto()

    await expect(currencyPage.container).toBeVisible()
    await expect(currencyPage.errorAlert).toHaveCount(0)
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows.first()).toBeVisible()
  })
})
