import { render, screen } from '@testing-library/react'
import App from 'App'

describe('<App />', () => {
  test('renders dpsCalc page', () => {
    render(<App />)

    const dpsCalc = screen.getByTestId('dpsCalc')
    expect(dpsCalc).toBeDefined()
  })
})
