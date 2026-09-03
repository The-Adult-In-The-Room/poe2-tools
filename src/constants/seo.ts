export const SITE_NAME = 'POE2 Tools'

export const SITE_URL = 'https://poe2-tools.up.railway.app/'

export const SITE_DESCRIPTION =
  'A browser-based toolkit for Path of Exile 2. Calculate weapon DPS and track live currency rates.'

export const FAVICON_PATH = '/favicon.ico'

export const DEFAULT_OG_IMAGE = '/og-image.png'

export const CURRENCY_OG_IMAGE = '/currency-og-image.png'

export const THEME_COLOR = '#121212'

export function pageTitle(segment: string): string {
  return `${segment} | ${SITE_NAME}`
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}
