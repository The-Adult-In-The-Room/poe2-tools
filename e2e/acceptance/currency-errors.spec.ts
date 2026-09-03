import { expect, test } from '../fixtures/test'

test.describe('currency error acceptance', () => {
  test('renders an error message when the API returns a 500', async ({ currencyPage }) => {
    await currencyPage.goto('?league=__error-500')

    await expect(currencyPage.errorAlert).toBeVisible()
    await expect(currencyPage.errorAlert).toContainText('Failed to load currency market')
    await expect(currencyPage.errorAlert).toContainText('500')
  })

  test('renders an error message when the API returns invalid data', async ({ currencyPage }) => {
    await currencyPage.goto('?league=__error-invalid')

    await expect(currencyPage.errorAlert).toBeVisible()
    await expect(currencyPage.errorAlert).toContainText('Failed to load currency market')
  })
})
