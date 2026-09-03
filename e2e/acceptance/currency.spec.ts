import { expect, test } from '../fixtures/test'

test.describe('currency acceptance', () => {
  test('renders currency rows from the mock server', async ({ currencyPage }) => {
    await currencyPage.goto()

    await expect(currencyPage.container).toBeVisible()
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows).toHaveCount(2)

    const firstRow = currencyPage.rows.first()
    await expect(firstRow).toContainText('Chaos Orb')
    await expect(firstRow).toContainText('2k')

    const secondRow = currencyPage.rows.nth(1)
    await expect(secondRow).toContainText('Exalted Orb')
    await expect(secondRow).toContainText('1k')
  })

  test('updates the table when the reference currency changes', async ({ currencyPage }) => {
    await currencyPage.goto()

    await expect(currencyPage.rows).toHaveCount(2)
    await currencyPage.selectReferenceCurrency('chaos')

    await expect(currencyPage.rows).toHaveCount(1)
    await expect(currencyPage.rows.first()).toContainText('Exalted Orb')
  })

  test('updates the URL and table when the league changes', async ({ currencyPage }) => {
    await currencyPage.goto()

    await currencyPage.selectLeague('standard')

    await expect(currencyPage.page).toHaveURL(/league=standard/)
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows).toHaveCount(2)
  })

  test('updates the URL and table when the category changes', async ({ currencyPage }) => {
    await currencyPage.goto()

    await currencyPage.selectCategory('Fragments')

    await expect(currencyPage.page).toHaveURL(/type=Fragments/)
    await expect(currencyPage.table).toBeVisible()
    await expect(currencyPage.rows).toHaveCount(1)
    await expect(currencyPage.rows.first()).toContainText("Awakener's Orb Fragment")
  })
})
