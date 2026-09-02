import { expect, test } from '@playwright/test'

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
  test('calculates DPS from pasted item text', async ({ page }) => {
    await page.goto('/')

    const pasteArea = page.getByTestId('pasteArea')
    await expect(pasteArea).toBeVisible()
    await pasteArea.fill(itemText)

    await expect(page.getByTestId('itemName')).toContainText('Woe Goad')
    await expect(page.getByTestId('itemName')).toContainText('Expert Barrier Quarterstaff')
    await expect(page.getByTestId('totalDps')).toContainText('TOTAL DPS: 347.90')

    await expect(page.getByTestId('physicalDps')).toContainText('233.80')
    await expect(page.getByTestId('fireDps')).toContainText('7.00')
    await expect(page.getByTestId('lightningDps')).toContainText('107.10')
    await expect(page.getByTestId('elementalDps')).toContainText('114.10')
  })

  test('calculates DPS from manually entered values', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Attacks Per Second *').fill('1.4')
    await page.getByLabel('physical Min').fill('10')
    await page.getByLabel('physical Max').fill('20')
    await page.getByLabel('fire Min').fill('5')
    await page.getByLabel('fire Max').fill('15')
    await page.getByLabel('cold Min').fill('2')
    await page.getByLabel('cold Max').fill('8')
    await page.getByLabel('lightning Min').fill('3')
    await page.getByLabel('lightning Max').fill('12')
    await page.getByLabel('chaos Min').fill('1')
    await page.getByLabel('chaos Max').fill('4')

    await expect(page.getByTestId('totalDps')).toContainText('TOTAL DPS: 56.00')
    await expect(page.getByTestId('physicalDps')).toContainText('21.00')
    await expect(page.getByTestId('fireDps')).toContainText('14.00')
    await expect(page.getByTestId('coldDps')).toContainText('7.00')
    await expect(page.getByTestId('lightningDps')).toContainText('10.50')
    await expect(page.getByTestId('chaosDps')).toContainText('3.50')
    await expect(page.getByTestId('elementalDps')).toContainText('31.50')
  })
})
