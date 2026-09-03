import type { APIResponse, Locator, Page } from '@playwright/test'

export class SeoPage {
  readonly page: Page
  readonly faviconLink: Locator
  readonly ogUrlMeta: Locator
  readonly ogImageMeta: Locator
  readonly twitterUrlMeta: Locator
  readonly twitterImageMeta: Locator

  constructor(page: Page) {
    this.page = page
    this.faviconLink = page.locator('link[rel="icon"]')
    this.ogUrlMeta = page.locator('meta[property="og:url"]')
    this.ogImageMeta = page.locator('meta[property="og:image"]')
    this.twitterUrlMeta = page.locator('meta[name="twitter:url"]')
    this.twitterImageMeta = page.locator('meta[name="twitter:image"]')
  }

  async title(): Promise<string> {
    return this.page.title()
  }

  async fetchFavicon(): Promise<APIResponse> {
    return this.page.request.get('/favicon.ico')
  }

  async fetchOgImage(): Promise<APIResponse> {
    const imageUrl = await this.ogImageMeta.getAttribute('content')
    const imagePath = imageUrl ? new URL(imageUrl).pathname : '/og-image.png'
    return this.page.request.get(imagePath)
  }
}
