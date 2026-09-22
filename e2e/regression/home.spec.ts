import { TESTDATA } from '#/data/testData'
import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user visits the deployed Weapon DPS calculator', () => {
  test('WHEN the page loads THEN the calculator is displayed', async ({ dpsCalcPage }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('THEN the weapon DPS calculator is displayed', async () => {
      await expect(dpsCalcPage.container).toBeVisible()
      await expect(dpsCalcPage.pasteArea).toBeVisible()
      await expect(dpsCalcPage.pageTitle).toBeVisible()
    })
  })

  test('WHEN an item is pasted THEN the total DPS is calculated', async ({ dpsCalcPage }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN an item with physical and elemental damage is pasted', async () => {
      await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)
    })

    await test.step('THEN the total DPS and per-type cards are displayed', async () => {
      await expect(dpsCalcPage.itemName).toContainText('Woe Goad')
      await expect(dpsCalcPage.itemName).toContainText('Expert Barrier Quarterstaff')
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 347.90')
      await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('233.80')
      await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('114.10')
    })
  })
})
