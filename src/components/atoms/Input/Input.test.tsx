import { render, screen } from '@testing-library/react'
import Input from './Input'

const props = {
  label: 'Test Label',
  id: 'test-id',
  name: 'test-name',
}

describe('<Input />', () => {
  describe('GIVEN the Input component is rendered', () => {
    beforeEach(() => {
      render(<Input {...props} />)
    })

    test('THEN the label is displayed', () => {
      expect(screen.getByText('Test Label')).toBeDefined()
    })

    test('THEN the input is displayed', () => {
      expect(screen.getByRole('textbox')).toBeDefined()
    })

    test('THEN the required span is not displayed', () => {
      expect(screen.queryByText('*')).toBeNull()
    })

    test('THEN the name prop is used for input name', () => {
      const input = screen.getByRole('textbox')
      expect(input.getAttribute('name')).toBe(props.name)
    })
  })

  describe('GIVEN the Input component is rendered with required prop', () => {
    beforeEach(() => {
      render(<Input {...props} required />)
    })

    test('THEN the required span is displayed', () => {
      expect(screen.getByText('*')).toBeDefined()
    })
  })

  describe('GIVEN the Input component is rendered with className prop', () => {
    beforeEach(() => {
      render(<Input {...props} className="test-class" />)
    })

    test('THEN the className is applied to the container', () => {
      const container = screen.getByTestId('input-container')
      expect(container.getAttribute('class')).toBe('flex flex-col test-class')
    })
  })

  describe('GIVEN the Input component is rendered without name prop', () => {
    beforeEach(() => {
      render(<Input {...props} name="" />)
    })

    test('THEN the id prop is used for input name', () => {
      const input = screen.getByRole('textbox')
      expect(input.getAttribute('name')).toBe(props.id)
    })
  })
})
