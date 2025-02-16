import { render, screen } from '@testing-library/react'
import Nav from './Nav'

const devPrefix = ''
const prodPrefix = '/poe2-tools'

describe('<Nav />', () => {
  test('renders header section', () => {
    render(<Nav />)
    expect(screen.getByText('Path of Exile 2')).toBeDefined()
    expect(screen.getByText('Tool kit')).toBeDefined()
  })

  test('in development, href has no prefix', () => {
    process.env.NODE_ENV = 'development'
    render(<Nav />)
    const link = screen.getByText('Weapon DPS Calculator')
    const href = link.getAttribute('href')

    expect(href).toBe(`${devPrefix}/`)
    process.env.NODE_ENV = 'test'
  })

  test('renders dps calculator link', () => {
    render(<Nav />)
    const link = screen.getByText('Weapon DPS Calculator')
    const href = link.getAttribute('href')

    expect(link).toBeDefined()
    expect(href).toBe(`${prodPrefix}/`)
  })
})
