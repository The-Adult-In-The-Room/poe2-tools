import { expect, test } from '../fixtures/test'

test.describe('GIVEN the user visits a page', () => {
  test('WHEN the home page loads THEN the page title and favicon are correct', async ({ dpsCalcPage, seoPage }) => {
    await test.step('GIVEN the user is on the home page', async () => {
      await dpsCalcPage.goto()
    })

    await test.step('THEN the page title, favicon, and social tags are correct', async () => {
      await expect.poll(async () => seoPage.title()).toBe('Weapon DPS Calculator | POE2 Tools')
      await expect(seoPage.faviconLink).toHaveAttribute('href', '/favicon.ico')
      await expect(seoPage.ogUrlMeta).toHaveAttribute('content', 'https://poe2-tools.up.railway.app/')
      await expect(seoPage.ogImageMeta).toHaveAttribute('content', 'https://poe2-tools.up.railway.app/og-image.png')
      await expect(seoPage.twitterUrlMeta).toHaveAttribute('content', 'https://poe2-tools.up.railway.app/')
      await expect(seoPage.twitterImageMeta).toHaveAttribute(
        'content',
        'https://poe2-tools.up.railway.app/og-image.png',
      )
      const faviconResponse = await seoPage.fetchFavicon()
      await expect(faviconResponse).toBeOK()
      const ogImageResponse = await seoPage.fetchOgImage()
      await expect(ogImageResponse).toBeOK()
    })
  })

  test('WHEN the currency page loads THEN the page title, favicon, and social tags are correct', async ({
    currencyPage,
    seoPage,
  }) => {
    await test.step('GIVEN the user is on the currency page', async () => {
      await currencyPage.goto()
    })

    await test.step('THEN the page title, favicon, and social tags are correct', async () => {
      await expect.poll(async () => seoPage.title()).toBe('Market Currency Rates | POE2 Tools')
      await expect(seoPage.faviconLink).toHaveAttribute('href', '/favicon.ico')
      await expect(seoPage.ogUrlMeta).toHaveAttribute('content', 'https://poe2-tools.up.railway.app/currency')
      await expect(seoPage.ogImageMeta).toHaveAttribute(
        'content',
        'https://poe2-tools.up.railway.app/currency-og-image.png',
      )
      await expect(seoPage.twitterUrlMeta).toHaveAttribute('content', 'https://poe2-tools.up.railway.app/currency')
      await expect(seoPage.twitterImageMeta).toHaveAttribute(
        'content',
        'https://poe2-tools.up.railway.app/currency-og-image.png',
      )
      const faviconResponse = await seoPage.fetchFavicon()
      await expect(faviconResponse).toBeOK()
      const ogImageResponse = await seoPage.fetchOgImage()
      await expect(ogImageResponse).toBeOK()
    })
  })
})
