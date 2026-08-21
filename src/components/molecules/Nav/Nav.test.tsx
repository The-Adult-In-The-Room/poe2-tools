import { render, screen } from '@testing-library/react'
import { externalLinks, internalLinks } from '#/data/constants'
import Nav from './Nav'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

describe('<Nav />', () => {
  describe('GIVEN the Nav component is rendered', () => {
    beforeEach(() => {
      render(<Nav />)
    })

    test('THEN the header section is displayed', () => {
      expect(screen.getByText('Path of Exile 2')).toBeDefined()
      expect(screen.getByText('Tool kit')).toBeDefined()
    })

    test.each(internalLinks)('THEN internal link "$label" is displayed', ({ href, label }) => {
      const link = screen.getByText(label)
      expect(link).toBeDefined()
      expect(link.closest('a')?.getAttribute('href')).toBe(href)
    })

    test.each(externalLinks)('THEN external link "$label" is displayed', ({ href, label }) => {
      const link = screen.getByText(label)
      expect(link).toBeDefined()
      expect(link.closest('a')?.getAttribute('href')).toBe(href)
    })
  })
})
