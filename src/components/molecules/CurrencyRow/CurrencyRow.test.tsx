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
      const imgs = screen.getAllByAltText('Divine Orb')
      expect(imgs.length).toBe(2)
      expect(imgs[0].getAttribute('src')).toContain('web.poecdn.com/gen/image/')
    })

    test('THEN the value is displayed as a ratio', () => {
      expect(screen.getByText('150.0')).toBeDefined()
      expect(screen.getByTestId('exchange-icon')).toBeDefined()
      expect(screen.getByText('1.0')).toBeDefined()
      const primaryImg = screen.getByTitle('Chaos Orb')
      expect(primaryImg).toBeDefined()
    })

    test('THEN the primary currency image is displayed in the value column', () => {
      const img = screen.getByTitle('Chaos Orb')
      expect(img).toBeDefined()
      expect(img.getAttribute('src')).toContain('web.poecdn.com/gen/image/chaos.png')
    })

    test('THEN the volume is displayed', () => {
      expect(screen.getByText('1k')).toBeDefined()
    })

    test('THEN the sparkline is displayed', () => {
      expect(screen.getByTestId('sparkline')).toBeDefined()
    })
  })

  describe('GIVEN the CurrencyRow component is rendered with small values', () => {
    test('THEN values < 1 show as 1 Div : N Item format', () => {
      const row = { ...mockRow, primaryValue: 0.05 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('1.0')).toBeDefined()
      expect(screen.getByText('20.0')).toBeDefined()
    })

    test('THEN very small values show decimals when not whole numbers', () => {
      const row = { ...mockRow, primaryValue: 0.0027 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('370.37')).toBeDefined()
    })

    test('THEN values >= 1 show as N Div : 1 Item format', () => {
      const row = { ...mockRow, primaryValue: 2.1 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('2.1')).toBeDefined()
    })

    test('THEN whole number values >= 1 show with .0 padding', () => {
      const row = { ...mockRow, primaryValue: 5 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('5.0')).toBeDefined()
    })

    test('THEN values >= 1000 show with k shorthand', () => {
      const row = { ...mockRow, primaryValue: 1500 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('1.5k')).toBeDefined()
    })

    test('THEN values >= 1000 with whole thousands show with .0k', () => {
      const row = { ...mockRow, primaryValue: 2000 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('2.0k')).toBeDefined()
    })

    test('THEN inverse values >= 1000 show with k shorthand', () => {
      const row = { ...mockRow, primaryValue: 0.0005 }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="/gen/image/chaos.png" />)
      expect(screen.getByText('2.0k')).toBeDefined()
    })
  })

  describe('GIVEN the CurrencyRow component is rendered with missing images', () => {
    test('THEN fallback icons are displayed when images are null', () => {
      const row = { ...mockRow, image: null }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage={null} />)
      const fallbackIcons = screen.getAllByTestId('question-icon')
      expect(fallbackIcons.length).toBe(3)
    })

    test('THEN fallback icons are displayed when images are empty strings', () => {
      const row = { ...mockRow, image: '' }
      render(<CurrencyRow row={row} primaryCurrencyName="Chaos Orb" primaryCurrencyImage="" />)
      const fallbackIcons = screen.getAllByTestId('question-icon')
      expect(fallbackIcons.length).toBe(3)
    })
  })
})
