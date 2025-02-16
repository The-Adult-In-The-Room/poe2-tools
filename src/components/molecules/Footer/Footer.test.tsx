import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('<Footer />', () => {
  test('renders created by as a hyperlink', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /Raymond Cox/i })
    const href = link.getAttribute('href')
    expect(href).toBe('https://github.com/Raymond-Cox')
  })

  test('renders designed by as a hyperlink', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /The Designer Dev/i })
    const href = link.getAttribute('href')
    expect(href).toBe('https://thedesignerdev.com/')
  })

  test('renders view source code as a hyperlink', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /View source code/i })
    const href = link.getAttribute('href')
    expect(href).toBe('https://github.com/Raymond-Cox/poe2-tools')
  })

  test('renders buy me a coffee as a hyperlink', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /Buy me a coffee/i })
    const href = link.getAttribute('href')
    expect(href).toBe('https://ko-fi.com/me_am')
  })
})
