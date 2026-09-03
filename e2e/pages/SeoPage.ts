import type { APIResponse, Locator, Page } from '@playwright/test'

export class SeoPage {
  readonly page: Page
  readonly faviconLink: Locator

  constructor(page: Page) {
    this.page = page
    this.faviconLink = page.locator('link[rel="icon"]')
  }

  async title(): Promise<string> {
    return this.page.title()
  }

  async fetchFavicon(): Promise<APIResponse> {
    return this.page.request.get('/favicon.ico')
  }
}
