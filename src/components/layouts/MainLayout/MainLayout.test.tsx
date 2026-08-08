import { render, screen } from '@testing-library/react'
import MainLayout from './MainLayout'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}))

describe('<MainLayout />', () => {
  test('renders children', () => {
    render(<MainLayout>Test Children</MainLayout>)

    const children = screen.getByText('Test Children')
    expect(children).toBeDefined()
  })

  test('renders Nav', () => {
    render(<MainLayout>Test Children</MainLayout>)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeDefined()
  })

  test('renders Footer', () => {
    render(<MainLayout>Test Children</MainLayout>)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeDefined()
  })
})
