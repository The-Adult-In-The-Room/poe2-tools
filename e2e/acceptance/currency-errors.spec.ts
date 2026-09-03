import { expect, test } from '../fixtures/test'

test.describe('GIVEN the Market Currency API returns an error', () => {
  test('WHEN the page loads with a 500 error THEN an error message is displayed', async ({ currencyPage }) => {
    await test.step('GIVEN the user navigates to the Market Currency page with a 500 error', async () => {
      await currencyPage.goto('?league=__error-500')
    })

    await test.step('THEN an error message with status 500 is displayed', async () => {
      await expect(currencyPage.errorAlert).toBeVisible()
      await expect(currencyPage.errorAlert).toContainText('Failed to load currency market')
      await expect(currencyPage.errorAlert).toContainText('500')
    })
  })

  test('WHEN the page loads with invalid data THEN an error message is displayed', async ({ currencyPage }) => {
    await test.step('GIVEN the user navigates to the Market Currency page with invalid data', async () => {
      await currencyPage.goto('?league=__error-invalid')
    })

    await test.step('THEN an error message is displayed', async () => {
      await expect(currencyPage.errorAlert).toBeVisible()
      await expect(currencyPage.errorAlert).toContainText('Failed to load currency market')
    })
  })
})
