import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user visits the deployed Market Currency page', () => {
  test('WHEN the page loads THEN live currency data is displayed without errors', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('THEN the market currency page is displayed without errors', async () => {
      await expect(currencyPage.container).toBeVisible()
      await expect(currencyPage.pageTitle).toBeVisible()
      await expect(currencyPage.errorAlert).toHaveCount(0)
      await expect(currencyPage.table).toBeVisible()
      await expect(currencyPage.rows.first()).toBeVisible()
    })
  })

  test('WHEN the category is changed THEN the table is updated', async ({ currencyPage }) => {
    await test.step('GIVEN the user is on the Market Currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('WHEN the category is changed to Fragments', async () => {
      await currencyPage.selectCategory('Fragments')
    })

    await test.step('THEN the URL is updated and the fragment table is rendered', async () => {
      await expect(currencyPage.page).toHaveURL(/type=Fragments/)
      await expect(currencyPage.table).toBeVisible()
      await expect(currencyPage.rows.first()).toBeVisible()
    })
  })
})
