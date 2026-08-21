import { render, screen } from '@testing-library/react'
import type { CurrencyOverview } from '#/types'
import CurrencyTable from './CurrencyTable'

const mockOverview: CurrencyOverview = {
  core: {
    primary: 'divine',
    secondary: 'chaos',
    rates: { chaos: 150 },
    items: [{ id: 'divine', name: 'Divine Orb', image: '/divine.png', category: 'Currency', detailsId: 'divine-orb' }],
  },
  lines: [
    {
      id: 'divine',
      primaryValue: 1,
      volumePrimaryValue: 1000,
      maxVolumeCurrency: 'chaos',
      maxVolumeRate: 150,
      sparkline: { totalChange: 0, data: [1, 1, 1] },
    },
    {
      id: 'chaos',
      primaryValue: 0.0067,
      volumePrimaryValue: 500,
      maxVolumeCurrency: 'divine',
      maxVolumeRate: 150,
      sparkline: { totalChange: -2.5, data: [0.007, 0.0068, 0.0067] },
    },
  ],
  items: [
    { id: 'divine', name: 'Divine Orb', image: '/divine.png', category: 'Currency', detailsId: 'divine-orb' },
    { id: 'chaos', name: 'Chaos Orb', image: '/chaos.png', category: 'Currency', detailsId: 'chaos-orb' },
  ],
}

describe('<CurrencyTable />', () => {
  describe('GIVEN the CurrencyTable component is rendered', () => {
    beforeEach(() => {
      render(<CurrencyTable overview={mockOverview} />)
    })

    test('THEN the table is displayed', () => {
      expect(screen.getByTestId('currency-table')).toBeDefined()
    })

    test('THEN the table headers are displayed', () => {
      expect(screen.getByText('Currency')).toBeDefined()
      expect(screen.getByText('Value')).toBeDefined()
      expect(screen.getByText('Volume/hr')).toBeDefined()
      expect(screen.getByText('7d Change')).toBeDefined()
      expect(screen.getByText('Trend')).toBeDefined()
    })

    test('THEN the currency rows are displayed', () => {
      const rows = screen.getAllByTestId('currency-row')
      expect(rows.length).toBe(1)
    })

    test('THEN the primary currency is excluded from rows', () => {
      expect(screen.queryByText('Divine Orb')).toBeNull()
    })

    test('THEN non-primary currencies are displayed', () => {
      expect(screen.getByText('Chaos Orb')).toBeDefined()
    })
  })

  describe('GIVEN the CurrencyTable has items with different volumes', () => {
    beforeEach(() => {
      const overviewWithMultiple: CurrencyOverview = {
        ...mockOverview,
        lines: [
          ...mockOverview.lines,
          {
            id: 'exalted',
            primaryValue: 0.5,
            volumePrimaryValue: 2000,
            maxVolumeCurrency: 'divine',
            maxVolumeRate: 2,
            sparkline: { totalChange: 1, data: [0.4, 0.45, 0.5] },
          },
        ],
        items: [
          ...mockOverview.items,
          { id: 'exalted', name: 'Exalted Orb', image: '/exalted.png', category: 'Currency', detailsId: 'exalted-orb' },
        ],
      }
      render(<CurrencyTable overview={overviewWithMultiple} />)
    })

    test('THEN rows are sorted by volume descending', () => {
      const rows = screen.getAllByTestId('currency-row')
      expect(rows.length).toBe(2)
      const firstRowName = rows[0].querySelector('span')?.textContent
      expect(firstRowName).toBe('Exalted Orb')
    })
  })

  describe('GIVEN the CurrencyTable has missing item metadata', () => {
    beforeEach(() => {
      const overviewWithMissingItems: CurrencyOverview = {
        core: {
          primary: 'unknown-primary',
          secondary: 'chaos',
          rates: {},
          items: [],
        },
        lines: [
          {
            id: 'mystery-currency',
            primaryValue: 1,
            volumePrimaryValue: 100,
            maxVolumeCurrency: 'chaos',
            maxVolumeRate: 1,
            sparkline: { totalChange: 0, data: [1, 1, 1] },
          },
        ],
        items: [],
      }
      render(<CurrencyTable overview={overviewWithMissingItems} />)
    })

    test('THEN the fallback primary name is used', () => {
      expect(screen.getByTitle('unknown-primary')).toBeDefined()
    })

    test('THEN the line id is used as fallback name', () => {
      expect(screen.getByText('mystery-currency')).toBeDefined()
    })
  })
})
