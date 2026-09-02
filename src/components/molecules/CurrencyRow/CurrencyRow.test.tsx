import { render, screen, within } from '@testing-library/react'
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

const renderRow = (row: CurrencyRateRow, primaryCurrencyName: string, primaryCurrencyImage: string | null) => {
  render(
    <table>
      <tbody>
        <CurrencyRow row={row} primaryCurrencyName={primaryCurrencyName} primaryCurrencyImage={primaryCurrencyImage} />
      </tbody>
    </table>,
  )
}

describe('<CurrencyRow />', () => {
  describe('GIVEN the CurrencyRow component is rendered', () => {
    beforeEach(() => {
      renderRow(mockRow, 'Chaos Orb', '/gen/image/chaos.png')
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
      const row = screen.getByTestId('currency-row')
      expect(within(row).getByTestId('currency-value-left').textContent).toBe('150.0')
      expect(screen.getByTestId('exchange-icon')).toBeDefined()
      expect(within(row).getByTestId('currency-value-right').textContent).toBe('1.0')
      const primaryImg = screen.getByTitle('Chaos Orb')
      expect(primaryImg).toBeDefined()
    })

    test('THEN the primary currency image is displayed in the value column', () => {
      const img = screen.getByTitle('Chaos Orb')
      expect(img).toBeDefined()
      expect(img.getAttribute('src')).toContain('web.poecdn.com/gen/image/chaos.png')
    })

    test('THEN the volume is displayed', () => {
      const row = screen.getByTestId('currency-row')
      expect(within(row).getByTestId('currency-volume').textContent).toBe('1k')
    })

    test('THEN the sparkline is displayed', () => {
      expect(screen.getByTestId('sparkline')).toBeDefined()
    })
  })

  describe('GIVEN the CurrencyRow component is rendered with small values', () => {
    test('THEN values < 1 show as 1 Div : N Item format', () => {
      const row = { ...mockRow, primaryValue: 0.05 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('1.0')
      expect(within(renderedRow).getByTestId('currency-value-right').textContent).toBe('20.0')
    })

    test('THEN very small values show decimals when not whole numbers', () => {
      const row = { ...mockRow, primaryValue: 0.0027 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-right').textContent).toBe('370.37')
    })

    test('THEN values >= 1 show as N Div : 1 Item format', () => {
      const row = { ...mockRow, primaryValue: 2.1 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('2.1')
    })

    test('THEN whole number values >= 1 show with .0 padding', () => {
      const row = { ...mockRow, primaryValue: 5 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('5.0')
    })

    test('THEN values >= 1000 show with k shorthand', () => {
      const row = { ...mockRow, primaryValue: 1500 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('1.5k')
    })

    test('THEN values >= 1000 with whole thousands show with .0k', () => {
      const row = { ...mockRow, primaryValue: 2000 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('2.0k')
    })

    test('THEN inverse values >= 1000 show with k shorthand', () => {
      const row = { ...mockRow, primaryValue: 0.0005 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-right').textContent).toBe('2.0k')
    })

    test('THEN values >= 1000000 show with M shorthand', () => {
      const row = { ...mockRow, primaryValue: 1500000 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('1.5M')
    })

    test('THEN values >= 1000000 with whole millions show with .0M', () => {
      const row = { ...mockRow, primaryValue: 2000000 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-left').textContent).toBe('2.0M')
    })

    test('THEN inverse values >= 1000000 show with M shorthand', () => {
      const row = { ...mockRow, primaryValue: 0.0000005 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-value-right').textContent).toBe('2.0M')
    })
  })

  describe('GIVEN the CurrencyRow component is rendered with large volume', () => {
    test('THEN volume >= 1000000 with whole millions shows without decimals', () => {
      const row = { ...mockRow, volumePrimaryValue: 2000000 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-volume').textContent).toBe('2M')
    })

    test('THEN volume >= 1000000 with fractional millions shows one decimal', () => {
      const row = { ...mockRow, volumePrimaryValue: 1500000 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-volume').textContent).toBe('1.5M')
    })

    test('THEN volume >= 1000 with fractional thousands shows one decimal', () => {
      const row = { ...mockRow, volumePrimaryValue: 1500 }
      renderRow(row, 'Chaos Orb', '/gen/image/chaos.png')
      const renderedRow = screen.getByTestId('currency-row')
      expect(within(renderedRow).getByTestId('currency-volume').textContent).toBe('1.5k')
    })
  })

  describe('GIVEN the CurrencyRow component is rendered with missing images', () => {
    test('THEN fallback icons are displayed when images are null', () => {
      const row = { ...mockRow, image: null }
      renderRow(row, 'Chaos Orb', null)
      const fallbackIcons = screen.getAllByTestId('question-icon')
      expect(fallbackIcons.length).toBe(3)
    })

    test('THEN fallback icons are displayed when images are empty strings', () => {
      const row = { ...mockRow, image: '' }
      renderRow(row, 'Chaos Orb', '')
      const fallbackIcons = screen.getAllByTestId('question-icon')
      expect(fallbackIcons.length).toBe(3)
    })
  })
})
