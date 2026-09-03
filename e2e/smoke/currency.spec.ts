import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user is on the Market Currency page', () => {
  test('WHEN the page loads THEN the market currency page is displayed without errors', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('THEN the market currency page is displayed without errors', async () => {
      await expect(currencyPage.container).toBeVisible()
      await expect(currencyPage.errorAlert).toHaveCount(0)
      await expect(currencyPage.table).toBeVisible()
      await expect(currencyPage.rows.first()).toBeVisible()
    })
  })
})
