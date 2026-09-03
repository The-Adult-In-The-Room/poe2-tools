import { expect, test } from '../fixtures/test'

const itemText = `Item Class: Quarterstaves
Rarity: Rare
Woe Goad
Expert Barrier Quarterstaff
--------
Physical Damage: 125-209 (augmented)
Elemental Damage: 3-7 (augmented), 3-150 (augmented)
Critical Hit Chance: 10.00%
Attacks per Second: 1.40
--------
Requirements:
Level: 79
Dex: 165
Int: 64
--------
Item Level: 83
--------
+12% to Block chance (implicit)
--------
115% increased Physical Damage
Adds 3 to 7 Fire Damage
Adds 3 to 150 Lightning Damage
+22% to Critical Damage Bonus
Leeches 8.13% of Physical Damage as Life
Causes 43% increased Stun Buildup`

test.describe('home acceptance', () => {
  test('calculates DPS from pasted item text', async ({ dpsCalcPage }) => {
    await dpsCalcPage.goto()
    await dpsCalcPage.pasteItemText(itemText)

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
