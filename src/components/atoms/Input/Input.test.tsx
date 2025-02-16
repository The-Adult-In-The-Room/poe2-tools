import { render, screen } from '@testing-library/react'
import Input from './Input'

const props = {
  label: 'Test Label',
  id: 'test-id',
  name: 'test-name',
}

describe('<Input />', () => {
  test('renders label', () => {
    render(<Input {...props} />)

    const label = screen.getByText('Test Label')
    expect(label).toBeDefined()
  })

  test('renders input', () => {
    render(<Input {...props} />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDefined()
  })

  test('does not render required span when required is falsey', () => {
    render(<Input {...props} />)

    const span = screen.queryByText('*')
    expect(span).toBeNull()
  })

  test('renders required span when required is true', () => {
    render(<Input {...props} required />)

    const span = screen.getByText('*')
    expect(span).toBeDefined()
  })

  test('applies className', () => {
    const testClass = 'test-class'
    render(<Input {...props} className={testClass} />)

    const container = screen.getByTestId('input-container')
    const containerStyles = container.getAttribute('class')
    expect(containerStyles).toBe(`container ${testClass}`)
  })

  test('uses name prop for input name when provided', () => {
    render(<Input {...props} />)

    const input = screen.getByRole('textbox')
    const name = input.getAttribute('name')
    expect(name).toBe(props.name)
  })

  test('uses id prop for input name when name isnt provided', () => {
    render(<Input {...props} name="" />)

    const input = screen.getByRole('textbox')
    const name = input.getAttribute('name')
    expect(name).toBe(props.id)
  })
})
