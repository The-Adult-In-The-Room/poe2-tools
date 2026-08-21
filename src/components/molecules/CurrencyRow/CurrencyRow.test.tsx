import { render, screen } from '@testing-library/react'
import type { CurrencyRateRow } from '#/types'
import CurrencyRow from './CurrencyRow'

const mockRow: CurrencyRateRow = {
  id: 'divine',
  name: 'Divine Orb',
  image: '/test-image.png',
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
      render(<CurrencyRow row={mockRow} primaryCurrencyName="Chaos Orb" />)
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
      expect(img.getAttribute('src')).toBe('https://poe.ninja/test-image.png')
    })

    test('THEN the value is displayed', () => {
      expect(screen.getByText('150.00 Chaos Orb')).toBeDefined()
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
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" />)
      expect(screen.getByText('0.0500 Chaos Orb')).toBeDefined()
    })

    test('THEN values < 0.01 are formatted with 6 decimals', () => {
      const row = { ...mockRow, primaryValue: 0.001234 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" />)
      expect(screen.getByText('0.001234 Chaos Orb')).toBeDefined()
    })
  })
})
