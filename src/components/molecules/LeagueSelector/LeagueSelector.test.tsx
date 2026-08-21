import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeagueSelector from './LeagueSelector'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

const mockLeagues = [
  { id: 'runes-of-aldur', name: 'Runes of Aldur' },
  { id: 'standard', name: 'Standard' },
]

describe('<LeagueSelector />', () => {
  describe('GIVEN the LeagueSelector component is rendered', () => {
    beforeEach(() => {
      render(<LeagueSelector leagues={mockLeagues} currentLeague="runes-of-aldur" currentType="Currency" />)
    })

    test('THEN the select element is displayed', () => {
      expect(screen.getByTestId('league-selector')).toBeDefined()
    })

    test('THEN all leagues are displayed as options', () => {
      expect(screen.getByText('Runes of Aldur')).toBeDefined()
      expect(screen.getByText('Standard')).toBeDefined()
    })

    test('THEN the current league is selected', () => {
      const select = screen.getByTestId('league-selector') as HTMLSelectElement
      expect(select.value).toBe('runes-of-aldur')
    })
  })

  describe('GIVEN the user changes the league selection', () => {
    test('THEN the onChange handler updates the URL', async () => {
      const user = userEvent.setup()
      let navigatedUrl = ''

      Object.defineProperty(window, 'location', {
        value: {
          get href() {
            return navigatedUrl || 'http://localhost:3000/currency'
          },
          set href(val: string) {
            navigatedUrl = val
          },
        },
        writable: true,
        configurable: true,
      })

      render(<LeagueSelector leagues={mockLeagues} currentLeague="runes-of-aldur" currentType="Currency" />)

      const select = screen.getByTestId('league-selector')
      await user.selectOptions(select, 'standard')

      expect(navigatedUrl).toContain('league=standard')
      expect(navigatedUrl).toContain('type=Currency')
    })
  })
})
