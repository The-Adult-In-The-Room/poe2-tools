import { expect, test } from '../fixtures/test'

test.describe('currency acceptance', () => {
  test('renders currency rows from the mock server', async ({ currencyPage }) => {
    await currencyPage.goto()

    await expect(currencyPage.container).toBeVisible()
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows).toHaveCount(11)

    await expect(currencyPage.rowName(0)).toContainText('Chaos Orb')
    await expect(currencyPage.rowVolume(0)).toHaveText('12k')
    await expect(currencyPage.rowName(1)).toContainText('Exalted Orb')
    await expect(currencyPage.rowVolume(1)).toHaveText('11k')
  })

  test('sorts currency rows by volume descending', async ({ currencyPage }) => {
    await currencyPage.goto()

    await expect(currencyPage.rows).toHaveCount(11)

    await expect(currencyPage.rowVolume(0)).toHaveText('12k')
    await expect(currencyPage.rowVolume(1)).toHaveText('11k')
    await expect(currencyPage.rowVolume(2)).toHaveText('10k')
    await expect(currencyPage.rowVolume(10)).toHaveText('2k')
  })

  test('converts values and preserves sorting when reference currency changes', async ({ currencyPage }) => {
    await currencyPage.goto()

    await expect(currencyPage.rowName(0)).toContainText('Chaos Orb')
    await expect(currencyPage.rowName(1)).toContainText('Exalted Orb')
    await expect(currencyPage.rowValueLeft(1)).toContainText('1.0')
    await expect(currencyPage.rowValueRight(1)).toContainText('20.0')

    await currencyPage.selectReferenceCurrency('chaos-orb')

    await expect(currencyPage.rows).toHaveCount(10)
    await expect(currencyPage.rowName(0)).toContainText('Exalted Orb')
    await expect(currencyPage.rowVolume(0)).toHaveText('11k')
    await expect(currencyPage.rowValueLeft(0)).toContainText('1.0')
    await expect(currencyPage.rowValueRight(0)).toContainText('2.0')
  })

  test('updates the URL and table when the league changes', async ({ currencyPage }) => {
    await currencyPage.goto()

    await currencyPage.selectLeague('standard')

    await expect(currencyPage.page).toHaveURL(/league=standard/)
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows).toHaveCount(11)
  })

  test('updates the URL and table when the category changes', async ({ currencyPage }) => {
    await currencyPage.goto()

    await currencyPage.selectCategory('Fragments')

    await expect(currencyPage.page).toHaveURL(/type=Fragments/)
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows).toHaveCount(11)
    await expect(currencyPage.rowName(0)).toContainText("Awakener's Orb Fragment")
    await expect(currencyPage.rowVolume(0)).toHaveText('12k')
  })
})
