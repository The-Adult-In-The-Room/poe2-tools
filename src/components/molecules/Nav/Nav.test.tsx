import { render, screen } from '@testing-library/react'
import Nav from './Nav'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

describe('<Nav />', () => {
  test('renders header section', () => {
    render(<Nav />)
    expect(screen.getByText('Path of Exile 2')).toBeDefined()
    expect(screen.getByText('Tool kit')).toBeDefined()
  })

  test('renders dps calculator link', () => {
    render(<Nav />)
    const link = screen.getByText('Weapon DPS Calculator')
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('/')
  })

  test('link navigates to home', () => {
    render(<Nav />)
    const link = screen.getByText('Weapon DPS Calculator')
    expect(link.getAttribute('href')).toBe('/')
  })
})
