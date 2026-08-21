import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('<Card />', () => {
  describe('GIVEN the Card component is rendered with children', () => {
    beforeEach(() => {
      render(<Card>Test</Card>)
    })

    test('THEN the children are displayed', () => {
      expect(screen.getByText('Test')).toBeDefined()
    })

    test('THEN the default color is applied', () => {
      const card = screen.getByText('Test')
      expect(card.getAttribute('style')).toBe('border-color: #8181ee;')
    })
  })

  describe('GIVEN the Card component is rendered with a custom color', () => {
    beforeEach(() => {
      render(<Card color="red">Test</Card>)
    })

    test('THEN the custom color is applied', () => {
      const card = screen.getByText('Test')
      expect(card.getAttribute('style')).toBe('border-color: #920202;')
    })
  })
})
