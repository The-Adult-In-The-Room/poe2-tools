import { expect, test } from '@playwright/test'

test.describe('navigation acceptance', () => {
  test('navigates between the DPS calculator and market currency pages', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('dpsCalc')).toBeVisible()
    await expect(page.getByText('Weapon DPS Calculator')).toBeVisible()

    await page.getByText('Market Currency').click()

    await expect(page).toHaveURL(/\/currency/)
    await expect(page.getByTestId('market-currency')).toBeVisible()
    await expect(page.getByText('Market Currency Rates')).toBeVisible()

    await page.getByText('Weapon DPS Calculator').click()

    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('dpsCalc')).toBeVisible()
    await expect(page.getByText('Copy and Paste Entry')).toBeVisible()
  })
})
