import { pageTitle } from './seo'

describe('GIVEN the SEO constants', () => {
  test('THEN pageTitle formats a segment with the site name', () => {
    expect(pageTitle('Weapon DPS Calculator')).toBe('Weapon DPS Calculator | POE2 Tools')
  })
})
