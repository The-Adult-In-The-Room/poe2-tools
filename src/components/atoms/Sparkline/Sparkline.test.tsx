import { render, screen } from '@testing-library/react'
import Sparkline from './Sparkline'

describe('<Sparkline />', () => {
  describe('GIVEN the Sparkline component is rendered with valid data', () => {
    beforeEach(() => {
      render(<Sparkline data={[10, 20, 15, 25, 30]} />)
    })

    test('THEN the SVG is displayed', () => {
      expect(screen.getByTestId('sparkline')).toBeDefined()
    })

    test('THEN the title element is present', () => {
      expect(screen.getByText('Price trend chart')).toBeDefined()
    })
  })

  describe('GIVEN the Sparkline component is rendered with insufficient data', () => {
    beforeEach(() => {
      render(<Sparkline data={[10]} />)
    })

    test('THEN the empty placeholder is displayed', () => {
      expect(screen.getByTestId('sparkline-empty')).toBeDefined()
    })
  })

  describe('GIVEN the Sparkline component is rendered with null values', () => {
    beforeEach(() => {
      render(<Sparkline data={[10, null, 20, null, 30]} />)
    })

    test('THEN the SVG is displayed with filtered data', () => {
      expect(screen.getByTestId('sparkline')).toBeDefined()
    })
  })

  describe('GIVEN the Sparkline component is rendered with custom dimensions', () => {
    beforeEach(() => {
      render(<Sparkline data={[10, 20, 30]} width={100} height={30} />)
    })

    test('THEN the SVG has the correct dimensions', () => {
      const svg = screen.getByTestId('sparkline')
      expect(svg.getAttribute('width')).toBe('100')
      expect(svg.getAttribute('height')).toBe('30')
    })
  })

  describe('GIVEN the Sparkline component is rendered with identical values', () => {
    beforeEach(() => {
      render(<Sparkline data={[5, 5, 5]} />)
    })

    test('THEN the SVG is displayed without errors', () => {
      expect(screen.getByTestId('sparkline')).toBeDefined()
    })
  })

  describe('GIVEN the Sparkline component is rendered with a custom title', () => {
    beforeEach(() => {
      render(<Sparkline data={[10, 20, 30]} title="Custom trend title" />)
    })

    test('THEN the title element uses the custom text', () => {
      expect(screen.getByText('Custom trend title')).toBeDefined()
    })

    test('THEN the aria-label matches the custom title', () => {
      expect(screen.getByTestId('sparkline').getAttribute('aria-label')).toBe('Custom trend title')
    })
  })

  describe('GIVEN the Sparkline component is rendered with the default title', () => {
    beforeEach(() => {
      render(<Sparkline data={[10, 20, 30]} />)
    })

    test('THEN the SVG has the img role', () => {
      expect(screen.getByTestId('sparkline').getAttribute('role')).toBe('img')
    })

    test('THEN the aria-label matches the default title', () => {
      expect(screen.getByTestId('sparkline').getAttribute('aria-label')).toBe('Price trend chart')
    })
  })
})
