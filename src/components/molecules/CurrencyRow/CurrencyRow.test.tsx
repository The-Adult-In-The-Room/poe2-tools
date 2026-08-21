import { render, screen } from '@testing-library/react'
import type { CurrencyRateRow } from '#/types'
import CurrencyRow from './CurrencyRow'

const mockRow: CurrencyRateRow = {
  id: 'divine',
  name: 'Divine Orb',
  image:
    '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNb2RWYWx1ZXMiLCJzY2FsZSI6MSwicmVhbG0iOiJwb2UyIn1d/2986e220b3/CurrencyModValues.png',
  detailsId: 'divine-orb',
  primaryValue: 150,
  volumePrimaryValue: 1000,
  maxVolumeCurrency: 'chaos',
  maxVolumeRate: 150,
  sparkline: {
    totalChange: 5.5,
    data: [100, 110, 105, 120, 150],
  },
  category: 'Currency',
}

describe('<CurrencyRow />', () => {
  describe('GIVEN the CurrencyRow component is rendered', () => {
    beforeEach(() => {
      render(<CurrencyRow row={mockRow} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
    })

    test('THEN the currency row is displayed', () => {
      expect(screen.getByTestId('currency-row')).toBeDefined()
    })

    test('THEN the currency name is displayed', () => {
      expect(screen.getByText('Divine Orb')).toBeDefined()
    })

    test('THEN the currency image is displayed', () => {
      const img = screen.getByAltText('Divine Orb')
      expect(img).toBeDefined()
      expect(img.getAttribute('src')).toContain('web.poecdn.com/gen/image/')
    })

    test('THEN the value is displayed', () => {
      expect(screen.getByText('150.00')).toBeDefined()
    })

    test('THEN the primary currency image is displayed in the value column', () => {
      const img = screen.getByTitle('Chaos Orb')
      expect(img).toBeDefined()
      expect(img.getAttribute('src')).toContain('web.poecdn.com/gen/image/chaos.png')
    })

    test('THEN the volume is displayed', () => {
      expect(screen.getByText('1,000')).toBeDefined()
    })

    test('THEN the sparkline is displayed', () => {
      expect(screen.getByTestId('sparkline')).toBeDefined()
    })
  })

  describe('GIVEN the CurrencyRow component is rendered with small values', () => {
    test('THEN values >= 0.01 are formatted with 4 decimals', () => {
      const row = { ...mockRow, primaryValue: 0.05 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('0.0500')).toBeDefined()
    })

    test('THEN values < 0.01 are formatted with 6 decimals', () => {
      const row = { ...mockRow, primaryValue: 0.001234 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('0.001234')).toBeDefined()
    })
  })
})
