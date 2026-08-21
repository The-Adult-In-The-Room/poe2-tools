import { render, screen } from '@testing-library/react'
import type { CurrencyLoaderData } from '#/types'
import MarketCurrency from './MarketCurrency'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}))

const mockLoaderData: CurrencyLoaderData = {
  leagues: [
    { id: 'runes-of-aldur', name: 'Runes of Aldur' },
    { id: 'standard', name: 'Standard' },
  ],
  overview: {
    core: {
      primary: 'divine',
      secondary: 'chaos',
      rates: { chaos: 150 },
      items: [
        { id: 'divine', name: 'Divine Orb', image: '/divine.png', category: 'Currency', detailsId: 'divine-orb' },
      ],
    },
    lines: [
      {
        id: 'chaos',
        primaryValue: 0.0067,
        volumePrimaryValue: 500,
        maxVolumeCurrency: 'divine',
        maxVolumeRate: 150,
        sparkline: { totalChange: -2.5, data: [0.007, 0.0068, 0.0067] },
      },
    ],
    items: [{ id: 'chaos', name: 'Chaos Orb', image: '/chaos.png', category: 'Currency', detailsId: 'chaos-orb' }],
  },
  league: 'runes-of-aldur',
  type: 'Currency',
  reference: 'divine',
}

describe('<MarketCurrency />', () => {
  describe('GIVEN the MarketCurrency component is rendered', () => {
    beforeEach(() => {
      render(<MarketCurrency loaderData={mockLoaderData} />)
    })

    test('THEN the page is displayed', () => {
      expect(screen.getByTestId('market-currency')).toBeDefined()
    })

    test('THEN the title is displayed', () => {
      expect(screen.getByText('Market Currency Rates')).toBeDefined()
    })

    test('THEN the league selector is displayed', () => {
      expect(screen.getByTestId('league-selector')).toBeDefined()
    })

    test('THEN the category tabs are displayed', () => {
      expect(screen.getByTestId('category-tabs')).toBeDefined()
    })

    test('THEN the reference currency selector is displayed', () => {
      expect(screen.getByTestId('reference-currency-selector')).toBeDefined()
    })

    test('THEN the currency table is displayed', () => {
      expect(screen.getByTestId('currency-table')).toBeDefined()
    })
  })

  describe('GIVEN the MarketCurrency component is rendered with no data', () => {
    beforeEach(() => {
      const emptyData: CurrencyLoaderData = {
        ...mockLoaderData,
        overview: { ...mockLoaderData.overview, lines: [] },
      }
      render(<MarketCurrency loaderData={emptyData} />)
    })

    test('THEN the no data message is displayed', () => {
      expect(screen.getByText('No data available for this selection.')).toBeDefined()
    })
  })

  describe('GIVEN the reference currency selector', () => {
    test('THEN all three reference currencies are available', () => {
      render(<MarketCurrency loaderData={mockLoaderData} />)
      const selector = screen.getByTestId('reference-currency-selector') as HTMLSelectElement
      const options = Array.from(selector.options).map((opt) => opt.value)
      expect(options).toContain('divine')
      expect(options).toContain('exalted')
      expect(options).toContain('chaos')
    })

    test('THEN the default selection is the reference from loaderData', () => {
      render(<MarketCurrency loaderData={mockLoaderData} />)
      const selector = screen.getByTestId('reference-currency-selector') as HTMLSelectElement
      expect(selector.value).toBe('divine')
    })
  })
})
