import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('<Footer />', () => {
  describe('GIVEN the Footer component is rendered', () => {
    beforeEach(() => {
      render(<Footer />)
    })

    test('THEN the created by link is displayed', () => {
      const link = screen.getByRole('link', { name: /Raymond Cox/i })
      expect(link.getAttribute('href')).toBe('https://github.com/The-Adult-In-The-Room')
    })

    test('THEN the designed by link is displayed', () => {
      const link = screen.getByRole('link', { name: /The Designer Dev/i })
      expect(link.getAttribute('href')).toBe('https://thedesignerdev.com/')
    })

    test('THEN the view source code link is displayed', () => {
      const link = screen.getByRole('link', { name: /View source code/i })
      expect(link.getAttribute('href')).toBe('https://github.com/The-Adult-In-The-Room/poe2-tools')
    })

    test('THEN the buy me a coffee link is displayed', () => {
      const link = screen.getByRole('link', { name: /Buy me a coffee/i })
      expect(link.getAttribute('href')).toBe('https://ko-fi.com/me_am')
    })
  })
})
