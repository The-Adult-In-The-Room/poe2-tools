import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockNavigate } from '#/test-utils/routerMocks'
import LeagueSelector from './LeagueSelector'

vi.mock('@tanstack/react-router', () => import('#/test-utils/routerMocks').then((m) => m.routerMock))

const mockLeagues = [
  { id: 'runes-of-aldur', name: 'Runes of Aldur' },
  { id: 'standard', name: 'Standard' },
]

describe('<LeagueSelector />', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

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
    test('THEN it navigates to the currency route preserving search params', async () => {
      const user = userEvent.setup()
      render(<LeagueSelector leagues={mockLeagues} currentLeague="runes-of-aldur" currentType="Currency" />)

      const select = screen.getByTestId('league-selector')
      await user.selectOptions(select, 'standard')

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/currency',
        search: expect.any(Function),
        replace: true,
      })

      const searchFn = mockNavigate.mock.calls[0][0].search
      expect(searchFn({ foo: 'bar' })).toEqual({ foo: 'bar', league: 'standard', type: 'Currency' })
    })
  })
})
