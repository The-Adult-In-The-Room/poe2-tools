import { expect, test } from '../fixtures/test'

test.describe('navigation acceptance', () => {
  test('navigates between the DPS calculator and market currency pages', async ({
    dpsCalcPage,
    currencyPage,
    navigation,
  }) => {
    await dpsCalcPage.goto()

    await expect(dpsCalcPage.container).toBeVisible()
    await expect(navigation.marketCurrencyLink).toBeVisible()

    await navigation.toMarketCurrency()

    await expect(currencyPage.page).toHaveURL(/\/currency/)
    await expect(currencyPage.container).toBeVisible()
    await expect(currencyPage.pageTitle).toBeVisible()

    await navigation.toDpsCalc()

    await expect(dpsCalcPage.page).toHaveURL('/')
    await expect(dpsCalcPage.container).toBeVisible()
    await expect(dpsCalcPage.pageTitle).toBeVisible()
  })
})
