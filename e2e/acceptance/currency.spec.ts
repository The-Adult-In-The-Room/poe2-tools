import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user is on the Market Currency page', () => {
  test('WHEN the page loads THEN currency rows are rendered from the mock server', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('THEN the currency table and rows are rendered', async () => {
      await expect(currencyPage.container).toBeVisible()
      await expect(currencyPage.table).toBeVisible()
      await expect(currencyPage.rows).toHaveCount(11)

      await expect(currencyPage.rowName(0)).toContainText('Chaos Orb')
      await expect(currencyPage.rowVolume(0)).toHaveText('12k')
      await expect(currencyPage.rowName(1)).toContainText('Exalted Orb')
      await expect(currencyPage.rowVolume(1)).toHaveText('11k')
    })
  })

  test('WHEN the page loads THEN currency rows are sorted by volume descending', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('THEN the currency rows are sorted by volume descending', async () => {
      await expect(currencyPage.rows).toHaveCount(11)

      await expect(currencyPage.rowVolume(0)).toHaveText('12k')
      await expect(currencyPage.rowVolume(1)).toHaveText('11k')
      await expect(currencyPage.rowVolume(2)).toHaveText('10k')
      await expect(currencyPage.rowVolume(10)).toHaveText('2k')
    })
  })

  test('WHEN the reference currency changes THEN values are converted and sorting is preserved', async ({
    currencyPage,
  }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('THEN the default currency rows and values are displayed', async () => {
      await expect(currencyPage.rowName(0)).toContainText('Chaos Orb')
      await expect(currencyPage.rowName(1)).toContainText('Exalted Orb')
      await expect(currencyPage.rowValueLeft(1)).toContainText('1.0')
      await expect(currencyPage.rowValueRight(1)).toContainText('20.0')
    })

    await test.step('WHEN the reference currency is changed to Chaos Orb', async () => {
      await currencyPage.selectReferenceCurrency('chaos-orb')
    })

    await test.step('THEN the values are converted and sorting is preserved', async () => {
      await expect(currencyPage.rows).toHaveCount(10)
      await expect(currencyPage.rowName(0)).toContainText('Exalted Orb')
      await expect(currencyPage.rowVolume(0)).toHaveText('11k')
      await expect(currencyPage.rowValueLeft(0)).toContainText('1.0')
      await expect(currencyPage.rowValueRight(0)).toContainText('2.0')
    })
  })

  test('WHEN the league is changed THEN the URL and table are updated', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('WHEN the league is changed to Standard', async () => {
      await currencyPage.selectLeague('standard')
    })

    await test.step('THEN the URL is updated and the table is rendered', async () => {
      await expect(currencyPage.page).toHaveURL(/league=standard/)
      await expect(currencyPage.table).toBeVisible()
      await expect(currencyPage.rows).toHaveCount(11)
    })
  })

  test('WHEN the category is changed THEN the URL and table are updated', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('WHEN the category is changed to Fragments', async () => {
      await currencyPage.selectCategory('Fragments')
    })

    await test.step('THEN the URL is updated and the fragment rows are rendered', async () => {
      await expect(currencyPage.page).toHaveURL(/type=Fragments/)
      await expect(currencyPage.table).toBeVisible()
      await expect(currencyPage.rows).toHaveCount(11)
      await expect(currencyPage.rowName(0)).toContainText("Awakener's Orb Fragment")
      await expect(currencyPage.rowVolume(0)).toHaveText('12k')
    })
  })
})
