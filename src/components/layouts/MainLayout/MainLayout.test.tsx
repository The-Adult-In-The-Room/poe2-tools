import { render, screen } from '@testing-library/react'
import MainLayout from './MainLayout'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className,
    activeProps,
    ...props
  }: {
    children: React.ReactNode
    to: string
    className?: string
    activeProps?: { className?: string }
  }) => (
    <a href={to} className={`${className ?? ''} ${activeProps?.className ?? ''}`.trim() || undefined} {...props}>
      {children}
    </a>
  ),
}))

describe('<MainLayout />', () => {
  describe('GIVEN the MainLayout component is rendered', () => {
    beforeEach(() => {
      render(<MainLayout>Test Children</MainLayout>)
    })

    test('THEN the children are displayed', () => {
      expect(screen.getByText('Test Children')).toBeDefined()
    })

    test('THEN the Nav is displayed', () => {
      expect(screen.getByRole('navigation')).toBeDefined()
    })

    test('THEN the Footer is displayed', () => {
      expect(screen.getByRole('contentinfo')).toBeDefined()
    })
  })
})
