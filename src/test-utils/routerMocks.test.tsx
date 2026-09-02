import { render, screen } from '@testing-library/react'
import { MockLink, mockNavigate, routerMock } from './routerMocks'

describe('routerMocks', () => {
  describe('MockLink', () => {
    test('renders a plain anchor with href and children', () => {
      render(<MockLink to="/currency">Currency</MockLink>)
      const link = screen.getByText('Currency').closest('a')
      expect(link?.getAttribute('href')).toBe('/currency')
    })

    test('works without className', () => {
      render(<MockLink to="/currency">Currency</MockLink>)
      const link = screen.getByText('Currency').closest('a')
      expect(link?.getAttribute('href')).toBe('/currency')
    })

    test('applies className', () => {
      render(
        <MockLink to="/currency" className="text-red">
          Currency
        </MockLink>,
      )
      const link = screen.getByText('Currency').closest('a')
      expect(link?.className).toContain('text-red')
    })

    test('applies activeProps.className without className', () => {
      render(
        <MockLink to="/currency" activeProps={{ className: 'text-blue' }}>
          Currency
        </MockLink>,
      )
      const link = screen.getByText('Currency').closest('a')
      expect(link?.className).toContain('text-blue')
    })

    test('merges activeProps.className with className', () => {
      render(
        <MockLink to="/currency" className="text-red" activeProps={{ className: 'text-blue' }}>
          Currency
        </MockLink>,
      )
      const link = screen.getByText('Currency').closest('a')
      expect(link?.className).toContain('text-red')
      expect(link?.className).toContain('text-blue')
    })

    test('renders data-replace when replace is true', () => {
      render(
        <MockLink to="/currency" replace>
          Currency
        </MockLink>,
      )
      const link = screen.getByText('Currency').closest('a')
      expect(link?.getAttribute('data-replace')).toBe('true')
    })

    test('does not render data-replace when replace is false', () => {
      render(
        <MockLink to="/currency" replace={false}>
          Currency
        </MockLink>,
      )
      const link = screen.getByText('Currency').closest('a')
      expect(link?.hasAttribute('data-replace')).toBe(false)
    })
  })

  describe('routerMock', () => {
    test('useNavigate returns mockNavigate spy', () => {
      expect(routerMock.useNavigate()).toBe(mockNavigate)
    })
  })
})
