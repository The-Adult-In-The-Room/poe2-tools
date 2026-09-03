import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user is on the Weapon DPS calculator', () => {
  test('WHEN the page loads THEN the weapon DPS calculator is displayed', async ({ dpsCalcPage }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('THEN the weapon DPS calculator is displayed', async () => {
      await expect(dpsCalcPage.container).toBeVisible()
      await expect(dpsCalcPage.pasteArea).toBeVisible()
    })
  })
})
