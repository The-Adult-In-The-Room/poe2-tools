import { expect, test } from '../fixtures/test'

test.describe('home smoke', () => {
  test('loads the weapon DPS calculator', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    await expect(dpsCalcPage.container).toBeVisible()
    await expect(dpsCalcPage.pasteArea).toBeVisible()
  })
})
