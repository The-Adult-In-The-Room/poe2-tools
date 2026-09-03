export const SITE_NAME = 'POE2 Tools'

export const SITE_DESCRIPTION =
  'A browser-based toolkit for Path of Exile 2. Calculate weapon DPS and track live currency rates.'

export const FAVICON_PATH = '/favicon.ico'

export const THEME_COLOR = '#121212'

export function pageTitle(segment: string): string {
  return `${segment} | ${SITE_NAME}`
}
