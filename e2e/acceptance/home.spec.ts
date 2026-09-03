import { TESTDATA } from '#/data/testData'
import { expect, test } from '../fixtures/test'

test.describe('home acceptance', () => {
  test('calculates DPS from pasted item text with physical and elemental damage', async ({ dpsCalcPage }) => {
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

  test('calculates DPS from pasted item text with elemental-only damage', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()
    await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_FIRE)

    await expect(dpsCalcPage.itemName).toContainText('Crackling Quarterstaff')
    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 46.90')

    await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('46.90')
    await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('46.90')
  })

  test('calculates DPS from manually entered physical-only values', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    await dpsCalcPage.enterAttacksPerSecond(TESTDATA.FORM_VALUES.ONLY_PHYSICAL.aps)
    await dpsCalcPage.enterDamageRange(
      'physical',
      TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMin,
      TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMax,
    )

    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 19.00')
    await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('19.00')
  })

  test('calculates DPS from manually entered chaos-only values', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    await dpsCalcPage.enterAttacksPerSecond(TESTDATA.FORM_VALUES.ONLY_CHAOS.aps)
    await dpsCalcPage.enterDamageRange(
      'chaos',
      TESTDATA.FORM_VALUES.ONLY_CHAOS.chaosMin,
      TESTDATA.FORM_VALUES.ONLY_CHAOS.chaosMax,
    )

    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 19.00')
    await expect(dpsCalcPage.dpsCard('chaosDps')).toContainText('19.00')
  })

  test('calculates DPS from manually entered physical, elemental, and chaos values', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    const values = TESTDATA.FORM_VALUES.CHAOS_AND_PHYSICAL_AND_ELEMENTS
    await dpsCalcPage.enterAttacksPerSecond(values.aps)
    await dpsCalcPage.enterDamageRange('physical', values.physicalMin, values.physicalMax)
    await dpsCalcPage.enterDamageRange('fire', values.fireMin, values.fireMax)
    await dpsCalcPage.enterDamageRange('cold', values.coldMin, values.coldMax)
    await dpsCalcPage.enterDamageRange('lightning', values.lightningMin, values.lightningMax)
    await dpsCalcPage.enterDamageRange('chaos', values.chaosMin, values.chaosMax)

    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 95.00')
    await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('19.00')
    await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('19.00')
    await expect(dpsCalcPage.dpsCard('coldDps')).toContainText('19.00')
    await expect(dpsCalcPage.dpsCard('lightningDps')).toContainText('19.00')
    await expect(dpsCalcPage.dpsCard('chaosDps')).toContainText('19.00')
    await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('57.00')
  })

  test('calculates DPS with default APS when none is provided', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    await dpsCalcPage.enterDamageRange(
      'physical',
      TESTDATA.FORM_VALUES.NO_APS.physicalMin,
      TESTDATA.FORM_VALUES.NO_APS.physicalMax,
    )

    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 9.50')
    await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('9.50')
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

  test('clears pasted item text and results', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()
    await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)

    await expect(dpsCalcPage.calculationResults).toBeVisible()

    await dpsCalcPage.clearPasteArea()

    await expect(dpsCalcPage.calculationResults).toBeHidden()
    await expect(dpsCalcPage.pasteArea).toHaveValue('')
  })

  test('shows calculation history after clearing the form', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()

    await dpsCalcPage.enterAttacksPerSecond(TESTDATA.FORM_VALUES.ONLY_PHYSICAL.aps)
    await dpsCalcPage.enterDamageRange(
      'physical',
      TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMin,
      TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMax,
    )

    await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 19.00')
    await expect(dpsCalcPage.historyFab).toBeHidden()

    await dpsCalcPage.clearForm()

    await expect(dpsCalcPage.calculationResults).toBeHidden()
    await expect(dpsCalcPage.historyFab).toBeVisible()

    await dpsCalcPage.openHistory()

    await expect(dpsCalcPage.calcHistory).toBeVisible()
    await expect(dpsCalcPage.calcHistory).toContainText('TOTAL DPS: 19.00')
  })
})
