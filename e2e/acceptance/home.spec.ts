import { TESTDATA } from '#/data/testData'
import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user is on the Weapon DPS calculator', () => {
  test('WHEN an item with physical and elemental damage is pasted THEN the total DPS and per-type cards are displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN an item with physical and elemental damage is pasted into the textarea', async () => {
      await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)
    })

    await test.step('THEN the item name, total DPS, and per-type cards are displayed', async () => {
      await expect(dpsCalcPage.itemName).toContainText('Woe Goad')
      await expect(dpsCalcPage.itemName).toContainText('Expert Barrier Quarterstaff')
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 347.90')

      await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('233.80')
      await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('7.00')
      await expect(dpsCalcPage.dpsCard('lightningDps')).toContainText('107.10')
      await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('114.10')
    })
  })

  test('WHEN an item with elemental-only damage is pasted THEN the total DPS and elemental cards are displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN an item with elemental-only damage is pasted into the textarea', async () => {
      await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_FIRE)
    })

    await test.step('THEN the item name, total DPS, and elemental cards are displayed', async () => {
      await expect(dpsCalcPage.itemName).toContainText('Crackling Quarterstaff')
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 46.90')

      await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('46.90')
      await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('46.90')
    })
  })

  test('WHEN physical-only values are entered manually THEN the total DPS and physical card are displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN physical-only values are entered into the form', async () => {
      await dpsCalcPage.enterAttacksPerSecond(TESTDATA.FORM_VALUES.ONLY_PHYSICAL.aps)
      await dpsCalcPage.enterDamageRange(
        'physical',
        TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMin,
        TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMax,
      )
    })

    await test.step('THEN the total DPS and physical card are displayed', async () => {
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 19.00')
      await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('19.00')
    })
  })

  test('WHEN chaos-only values are entered manually THEN the total DPS and chaos card are displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN chaos-only values are entered into the form', async () => {
      await dpsCalcPage.enterAttacksPerSecond(TESTDATA.FORM_VALUES.ONLY_CHAOS.aps)
      await dpsCalcPage.enterDamageRange(
        'chaos',
        TESTDATA.FORM_VALUES.ONLY_CHAOS.chaosMin,
        TESTDATA.FORM_VALUES.ONLY_CHAOS.chaosMax,
      )
    })

    await test.step('THEN the total DPS and chaos card are displayed', async () => {
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 19.00')
      await expect(dpsCalcPage.dpsCard('chaosDps')).toContainText('19.00')
    })
  })

  test('WHEN physical, elemental, and chaos values are entered manually THEN the total DPS and per-type cards are displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN physical, elemental, and chaos values are entered into the form', async () => {
      const values = TESTDATA.FORM_VALUES.CHAOS_AND_PHYSICAL_AND_ELEMENTS
      await dpsCalcPage.enterAttacksPerSecond(values.aps)
      await dpsCalcPage.enterDamageRange('physical', values.physicalMin, values.physicalMax)
      await dpsCalcPage.enterDamageRange('fire', values.fireMin, values.fireMax)
      await dpsCalcPage.enterDamageRange('cold', values.coldMin, values.coldMax)
      await dpsCalcPage.enterDamageRange('lightning', values.lightningMin, values.lightningMax)
      await dpsCalcPage.enterDamageRange('chaos', values.chaosMin, values.chaosMax)
    })

    await test.step('THEN the total DPS and per-type cards are displayed', async () => {
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 95.00')
      await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('19.00')
      await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('19.00')
      await expect(dpsCalcPage.dpsCard('coldDps')).toContainText('19.00')
      await expect(dpsCalcPage.dpsCard('lightningDps')).toContainText('19.00')
      await expect(dpsCalcPage.dpsCard('chaosDps')).toContainText('19.00')
      await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('57.00')
    })
  })

  test('WHEN damage values are entered without APS THEN the total DPS uses the default APS', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN damage values are entered without attacks per second', async () => {
      await dpsCalcPage.enterDamageRange(
        'physical',
        TESTDATA.FORM_VALUES.NO_APS.physicalMin,
        TESTDATA.FORM_VALUES.NO_APS.physicalMax,
      )
    })

    await test.step('THEN the total DPS and physical card are displayed using the default APS', async () => {
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 9.50')
      await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('9.50')
    })
  })

  test('WHEN all damage values are entered manually THEN the total DPS and per-type cards are displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN all damage values are entered into the form', async () => {
      await dpsCalcPage.enterAttacksPerSecond('1.4')
      await dpsCalcPage.enterDamageRange('physical', '10', '20')
      await dpsCalcPage.enterDamageRange('fire', '5', '15')
      await dpsCalcPage.enterDamageRange('cold', '2', '8')
      await dpsCalcPage.enterDamageRange('lightning', '3', '12')
      await dpsCalcPage.enterDamageRange('chaos', '1', '4')
    })

    await test.step('THEN the total DPS and per-type cards are displayed', async () => {
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 56.00')
      await expect(dpsCalcPage.dpsCard('physicalDps')).toContainText('21.00')
      await expect(dpsCalcPage.dpsCard('fireDps')).toContainText('14.00')
      await expect(dpsCalcPage.dpsCard('coldDps')).toContainText('7.00')
      await expect(dpsCalcPage.dpsCard('lightningDps')).toContainText('10.50')
      await expect(dpsCalcPage.dpsCard('chaosDps')).toContainText('3.50')
      await expect(dpsCalcPage.dpsCard('elementalDps')).toContainText('31.50')
    })
  })

  test('WHEN the pasted item text is cleared THEN the results are hidden and the textarea is empty', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN an item is pasted into the textarea', async () => {
      await dpsCalcPage.pasteItemText(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)
    })

    await test.step('THEN the calculation results are displayed', async () => {
      await expect(dpsCalcPage.calculationResults).toBeVisible()
    })

    await test.step('WHEN the pasted text is cleared', async () => {
      await dpsCalcPage.clearPasteArea()
    })

    await test.step('THEN the results are hidden and the textarea is empty', async () => {
      await expect(dpsCalcPage.calculationResults).toBeHidden()
      await expect(dpsCalcPage.pasteArea).toHaveValue('')
    })
  })

  test('WHEN the form is cleared after calculating DPS THEN the calculation history is displayed', async ({
    dpsCalcPage,
  }) => {
    await test.step('GIVEN the user is on the Weapon DPS calculator', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('WHEN physical damage values are entered into the form', async () => {
      await dpsCalcPage.enterAttacksPerSecond(TESTDATA.FORM_VALUES.ONLY_PHYSICAL.aps)
      await dpsCalcPage.enterDamageRange(
        'physical',
        TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMin,
        TESTDATA.FORM_VALUES.ONLY_PHYSICAL.physicalMax,
      )
    })

    await test.step('THEN the total DPS is displayed and the history FAB is hidden', async () => {
      await expect(dpsCalcPage.totalDps).toContainText('TOTAL DPS: 19.00')
      await expect(dpsCalcPage.historyFab).toBeHidden()
    })

    await test.step('WHEN the form is cleared', async () => {
      await dpsCalcPage.clearForm()
    })

    await test.step('THEN the calculation results are hidden and the history FAB is visible', async () => {
      await expect(dpsCalcPage.calculationResults).toBeHidden()
      await expect(dpsCalcPage.historyFab).toBeVisible()
    })

    await test.step('WHEN the history is opened', async () => {
      await dpsCalcPage.openHistory()
    })

    await test.step('THEN the calculation history is displayed', async () => {
      await expect(dpsCalcPage.calcHistory).toBeVisible()
      await expect(dpsCalcPage.calcHistory).toContainText('TOTAL DPS: 19.00')
    })
  })
})
