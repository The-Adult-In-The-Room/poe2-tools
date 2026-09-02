import { expect, test } from '@playwright/test'

test.describe('currency error acceptance', () => {
  test('renders an error message when the API returns a 500', async ({ page }) => {
    await page.goto('/currency?league=__error-500')

    const alert = page.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText('Failed to load currency market')
    await expect(alert).toContainText('500')
  })

  test('renders an error message when the API returns invalid data', async ({ page }) => {
    await page.goto('/currency?league=__error-invalid')

    const alert = page.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText('Failed to load currency market')
  })
})
