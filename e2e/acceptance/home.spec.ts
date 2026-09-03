import { TESTDATA } from '#/data/testData'
import { expect, test } from '../fixtures/test'

test.describe('home acceptance', () => {
  test('calculates DPS from pasted item text', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()
    await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)

    await expect(dpsCalcPage.itemName).toContainText('Woe Goad')
    await expect(dpsCalcPage.itemName).toContainText('Expert Barrier Quarterstaff')
    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 347.90')

    await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('233.80')
    await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('7.00')
    await expect(dpsCalcPage.dpsCard('lightningDps')).toContainText('107.10')
    await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('114.10')
  })

  test('calculates DPS from manually entered values', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    await dpsCalcPage.enterAttacksPerSecond('1.4')
    await dpsCalcPage.enterDamageRange('physical', '10', '20')
    await dpsCalcPage.enterDamageRange('fire', '5', '15')
    await dpsCalcPage.enterDamageRange('cold', '2', '8')
    await dpsCalcPage.enterDamageRange('lightning', '3', '12')
    await dpsCalcPage.enterDamageRange('chaos', '1', '4')

    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 56.00')
    await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('21.00')
    await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('14.00')
    await expect(dpsCalcPage.dpsCard('coldDps')).toContainText('7.00')
    await expect(dpsCalcPage.dpsCard('lightningDps')).toContainText('10.50')
    await expect(dpsCalcPage.dpsCard('chaosDps')).toContainText('3.50')
    await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('31.50')
  })
})
