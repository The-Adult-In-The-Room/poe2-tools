import { absoluteUrl, pageTitle } from './seo'

describe('GIVEN the SEO constants', () => {
  test('THEN pageTitle formats a segment with the site name', () => {
    expect(pageTitle('Weapon DPS Calculator')).toBe('Weapon DPS Calculator | POE2 Tools')
  })

  test('THEN absoluteUrl resolves a path against the site URL', () => {
    expect(absoluteUrl('/currency-og-image.png')).toBe('https://poe2-tools.up.railway.app/currency-og-image.png')
  })
})
