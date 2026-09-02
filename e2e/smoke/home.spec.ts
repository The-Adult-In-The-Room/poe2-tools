import { expect, test } from '@playwright/test'

test.describe('home smoke', () => {
  test('loads the weapon DPS calculator', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('dpsCalc')).toBeVisible()
    await expect(page.getByTestId('pasteArea')).toBeVisible()
  })
})
