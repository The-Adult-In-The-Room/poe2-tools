import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user is navigating the application', () => {
  test('WHEN the user navigates between the DPS calculator and Market Currency pages THEN the correct pages are displayed', async ({
    dpsCalcPage,
    currencyPage,
    navigation,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('THEN the DPS calculator and Market Currency link are displayed', async () => {
      await expect(dpsCalcPage.container).toBeVisible()
      await expect(navigation.marketCurrencyLink).toBeVisible()
    })

    await test.step('WHEN the user navigates to the Market Currency page', async () => {
      await navigation.toMarketCurrency()
    })

    await test.step('THEN the Market Currency page is displayed', async () => {
      await expect(currencyPage.page).toHaveURL(/\/currency/)
      await expect(currencyPage.container).toBeVisible()
      await expect(currencyPage.pageTitle).toBeVisible()
    })

    await test.step('WHEN the user navigates back to the Weapon DPS calculator', async () => {
      await navigation.toDpsCalc()
    })

    await test.step('THEN the Weapon DPS calculator is displayed', async () => {
      await expect(dpsCalcPage.page).toHaveURL('/')
      await expect(dpsCalcPage.container).toBeVisible()
      await expect(dpsCalcPage.pageTitle).toBeVisible()
    })
  })
})
