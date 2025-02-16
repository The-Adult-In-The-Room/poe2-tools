import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('<Card />', () => {
  test('renders children', () => {
    render(<Card>Test</Card>)
    expect(screen.getByText('Test')).toBeDefined()
  })

  test('renders with default color', () => {
    render(<Card>Test</Card>)
    const card = screen.getByText('Test')
    const cardStyle = card.getAttribute('style')

    expect(cardStyle).toBe('border-color: #8181ee;')
  })

  test('renders with custom color', () => {
    render(<Card color="red">Test</Card>)
    const card = screen.getByText('Test')
    const cardStyle = card.getAttribute('style')

    expect(cardStyle).toBe('border-color: #920202;')
  })
})
