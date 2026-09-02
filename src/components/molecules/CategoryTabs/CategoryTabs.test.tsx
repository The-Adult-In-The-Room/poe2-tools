import { render, screen } from '@testing-library/react'
import CategoryTabs from './CategoryTabs'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className,
    replace,
    ...props
  }: {
    children: React.ReactNode
    to: string
    className?: string
    replace?: boolean
  }) => (
    <a href={to} className={className} data-replace={String(replace)} {...props}>
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

  describe('GIVEN the current category tab', () => {
    test('THEN the active tab has the active styling', () => {
      render(<CategoryTabs currentLeague="standard" currentType="Runes" />)
      const activeTab = screen.getByText('Runes').closest('a')
      expect(activeTab?.className).toContain('bg-primary-a50')
    })

    test('THEN inactive tabs do not have the active styling', () => {
      render(<CategoryTabs currentLeague="standard" currentType="Runes" />)
      const inactiveTab = screen.getByText('Currency').closest('a')
      expect(inactiveTab?.className).not.toContain('bg-primary-a50')
    })
  })

  describe('GIVEN a category tab link', () => {
    test('THEN it replaces history instead of pushing', () => {
      render(<CategoryTabs currentLeague="standard" currentType="Currency" />)
      const tab = screen.getByText('Runes').closest('a')
      expect(tab?.getAttribute('data-replace')).toBe('true')
    })
  })
})
