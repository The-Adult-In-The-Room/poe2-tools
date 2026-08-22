import { render, screen } from '@testing-library/react'
import CategoryTabs from './CategoryTabs'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

describe('<CategoryTabs />', () => {
  describe('GIVEN the CategoryTabs component is rendered', () => {
    beforeEach(() => {
      render(<CategoryTabs currentLeague="standard" currentType="Currency" />)
    })

    test('THEN the navigation is displayed', () => {
      expect(screen.getByTestId('category-tabs')).toBeDefined()
    })

    test('THEN all category tabs are displayed', () => {
      expect(screen.getByText('Currency')).toBeDefined()
      expect(screen.getByText('Fragments')).toBeDefined()
      expect(screen.getByText('Essences')).toBeDefined()
      expect(screen.getByText('Soul Cores')).toBeDefined()
      expect(screen.getByText('Runes')).toBeDefined()
      expect(screen.getByText('Idols')).toBeDefined()
    })
  })
})
