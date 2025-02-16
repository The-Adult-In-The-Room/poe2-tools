import { render, screen, within } from '@testing-library/react'
import { setup } from 'utils/testUtils'
import DpsCalc from './DpsCalc'
import { TESTDATA } from 'data/testData'

describe('<DpsCalc />', () => {
  describe('copy and paste section', () => {
    describe('rendering', () => {
      test('should render the header', () => {
        render(<DpsCalc />)

        expect(screen.getByText('Copy and Paste Entry')).toBeDefined()
      })

      test('should render the text area', () => {
        render(<DpsCalc />)

        expect(
          screen.getByPlaceholderText('CTRL + C on your weapon in-game and then CTRL + V into this area.')
        ).toBeDefined()
      })

      test('should render the clear button', () => {
        render(<DpsCalc />)

        expect(screen.getByText('Clear')).toBeDefined()
      })
    })

    describe('functionality', () => {
      test('should show calculated dps on paste', async () => {
        const { user } = setup(<DpsCalc />)

        const textArea = screen.getByPlaceholderText(
          'CTRL + C on your weapon in-game and then CTRL + V into this area.'
        )
        await user.click(textArea)
        await user.paste(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)

        const physCard = screen.getByTestId('physicalDps')
        const fireCard = screen.getByTestId('fireDps')
        const lightningCard = screen.getByTestId('lightningDps')
        const elementalCard = screen.getByTestId('elementalDps')

        expect(within(physCard).getByText('233.80')).toBeDefined()
        expect(within(fireCard).getByText('7.00')).toBeDefined()
        expect(within(lightningCard).getByText('107.10')).toBeDefined()
        expect(within(elementalCard).getByText('114.10')).toBeDefined()

        expect(screen.getByText('TOTAL DPS: 347.90')).toBeDefined()
      })

      test('should show item name', async () => {
        const { user } = setup(<DpsCalc />)

        const textArea = screen.getByPlaceholderText(
          'CTRL + C on your weapon in-game and then CTRL + V into this area.'
        )
        await user.click(textArea)
        await user.paste(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)

        expect(screen.getByTestId('itemName')).toBeDefined()
        expect(screen.getByText('Woe Goad')).toBeDefined()
        expect(screen.getByText('Expert Barrier Quarterstaff')).toBeDefined()
      })

      test('should set text fields to derived values from pasted item', async () => {
        const { user } = setup(<DpsCalc />)

        const textArea = screen.getByPlaceholderText(
          'CTRL + C on your weapon in-game and then CTRL + V into this area.'
        )
        await user.click(textArea)
        await user.paste(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')
        const fireMin = screen.getByLabelText('fire Min')
        const fireMax = screen.getByLabelText('fire Max')
        const lightningMin = screen.getByLabelText('lightning Min')
        const lightningMax = screen.getByLabelText('lightning Max')

        const apsValue = aps.getAttribute('value')
        const physMinValue = physMin.getAttribute('value')
        const physMaxValue = physMax.getAttribute('value')
        const fireMinValue = fireMin.getAttribute('value')
        const fireMaxValue = fireMax.getAttribute('value')
        const lightningMinValue = lightningMin.getAttribute('value')
        const lightningMaxValue = lightningMax.getAttribute('value')

        expect(apsValue).toBe('1.40')
        expect(physMinValue).toBe('125')
        expect(physMaxValue).toBe('209')
        expect(fireMinValue).toBe('3')
        expect(fireMaxValue).toBe('7')
        expect(lightningMinValue).toBe('3')
        expect(lightningMaxValue).toBe('150')
      })

      test('should clear the form on "Clear" click', async () => {
        const { user } = setup(<DpsCalc />)

        const textArea = screen.getByPlaceholderText(
          'CTRL + C on your weapon in-game and then CTRL + V into this area.'
        )
        await user.click(textArea)
        await user.paste(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)

        expect(screen.getByTestId('calculationResults')).toBeDefined()

        const clearButton = screen.getByText('Clear')
        await user.click(clearButton)

        expect(screen.queryByTestId('calculationResults')).toBeNull()

        const formInputs = screen.getAllByRole('textbox')
        formInputs.forEach((input) => {
          const name = input.getAttribute('name')
          const value = input.getAttribute('value')

          // Check if the input has a name attribute,
          // This would exclude the copy and paste section textarea
          if (name) expect(value).toBe('')
        })

        const pasteArea = screen.getByTestId('pasteArea')
        const pasteAreaValue = pasteArea.getAttribute('value')

        expect(pasteAreaValue).toBe(null)
      })
    })
  })

  describe('manual calculation section', () => {
    describe('rendering', () => {
      test('should render the header', () => {
        render(<DpsCalc />)

        expect(screen.getByText('Manual Calculation Entry')).toBeDefined()
      })

      test('should render the attacks per second input', () => {
        render(<DpsCalc />)

        expect(screen.getByLabelText('Attacks Per Second *')).toBeDefined()
      })

      test('should render the damage type inputs', () => {
        render(<DpsCalc />)

        expect(screen.getByLabelText('physical Min')).toBeDefined()
        expect(screen.getByLabelText('physical Max')).toBeDefined()
        expect(screen.getByLabelText('fire Min')).toBeDefined()
        expect(screen.getByLabelText('fire Max')).toBeDefined()
        expect(screen.getByLabelText('cold Min')).toBeDefined()
        expect(screen.getByLabelText('cold Max')).toBeDefined()
        expect(screen.getByLabelText('lightning Min')).toBeDefined()
        expect(screen.getByLabelText('lightning Max')).toBeDefined()
        expect(screen.getByLabelText('chaos Min')).toBeDefined()
        expect(screen.getByLabelText('chaos Max')).toBeDefined()
      })

      test('should render the clear form button', () => {
        render(<DpsCalc />)

        expect(screen.getByText('Clear Form')).toBeDefined()
      })

      test('should not render history fab initially', () => {
        render(<DpsCalc />)

        expect(screen.queryByTestId('historyFab')).toBeNull()
      })
    })

    describe('functionality', () => {
      test('should show calculated dps', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')

        const physCard = screen.getByTestId('physicalDps')

        expect(within(physCard).getByText('21.00')).toBeDefined()
        expect(screen.getByText('TOTAL DPS: 21.00')).toBeDefined()
      })

      test('should not show item name', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')

        expect(screen.queryByTestId('itemName')).toBeNull()
        expect(screen.getByText('TOTAL DPS: 21.00')).toBeDefined()
      })

      test('should handle multiple damage types', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')
        const fireMin = screen.getByLabelText('fire Min')
        const fireMax = screen.getByLabelText('fire Max')
        const coldMin = screen.getByLabelText('cold Min')
        const coldMax = screen.getByLabelText('cold Max')
        const lightningMin = screen.getByLabelText('lightning Min')
        const lightningMax = screen.getByLabelText('lightning Max')
        const chaosMin = screen.getByLabelText('chaos Min')
        const chaosMax = screen.getByLabelText('chaos Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')
        await user.type(fireMin, '5')
        await user.type(fireMax, '15')
        await user.type(coldMin, '2')
        await user.type(coldMax, '8')
        await user.type(lightningMin, '3')
        await user.type(lightningMax, '12')
        await user.type(chaosMin, '1')
        await user.type(chaosMax, '4')

        const physCard = screen.getByTestId('physicalDps')
        const fireCard = screen.getByTestId('fireDps')
        const coldCard = screen.getByTestId('coldDps')
        const lightningCard = screen.getByTestId('lightningDps')
        const chaosCard = screen.getByTestId('chaosDps')
        const elementalCard = screen.getByTestId('elementalDps')

        expect(within(physCard).getByText('21.00')).toBeDefined()
        expect(within(fireCard).getByText('14.00')).toBeDefined()
        expect(within(coldCard).getByText('7.00')).toBeDefined()
        expect(within(lightningCard).getByText('10.50')).toBeDefined()
        expect(within(chaosCard).getByText('3.50')).toBeDefined()
        expect(within(elementalCard).getByText('31.50')).toBeDefined()

        expect(screen.getByText('TOTAL DPS: 56.00')).toBeDefined()
      })

      test('should not render any cards with 0 total dps', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '0')
        await user.type(physMax, '0')

        expect(screen.queryByTestId('physicalDps')).toBeNull()
        expect(screen.queryByTestId('fireDps')).toBeNull()
        expect(screen.queryByTestId('coldDps')).toBeNull()
        expect(screen.queryByTestId('lightningDps')).toBeNull()
        expect(screen.queryByTestId('chaosDps')).toBeNull()
        expect(screen.queryByTestId('totalDps')).toBeNull()
      })

      test('should not render individual cards with 0 dps', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')
        const fireMin = screen.getByLabelText('fire Min')
        const fireMax = screen.getByLabelText('fire Max')
        const coldMin = screen.getByLabelText('cold Min')
        const coldMax = screen.getByLabelText('cold Max')
        const lightningMin = screen.getByLabelText('lightning Min')
        const lightningMax = screen.getByLabelText('lightning Max')
        const chaosMin = screen.getByLabelText('chaos Min')
        const chaosMax = screen.getByLabelText('chaos Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '0')
        await user.type(physMax, '0')
        await user.type(fireMin, '3')
        await user.type(fireMax, '5')
        await user.type(coldMin, '0')
        await user.type(coldMax, '0')
        await user.type(lightningMin, '2')
        await user.type(lightningMax, '4')
        await user.type(chaosMin, '0')
        await user.type(chaosMax, '0')

        expect(screen.queryByTestId('physicalDps')).toBeNull()
        expect(screen.getByTestId('fireDps')).toBeDefined()
        expect(screen.queryByTestId('coldDps')).toBeNull()
        expect(screen.getByTestId('lightningDps')).toBeDefined()
        expect(screen.queryByTestId('chaosDps')).toBeNull()
        expect(screen.getByTestId('totalDps')).toBeDefined()
      })

      test('should clear the form on "Clear Form" click', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')

        expect(screen.getByTestId('calculationResults')).toBeDefined()

        const clearButton = screen.getByText('Clear Form')
        await user.click(clearButton)

        expect(screen.queryByTestId('calculationResults')).toBeNull()

        const formInputs = screen.getAllByRole('textbox')
        formInputs.forEach((input) => {
          const name = input.getAttribute('name')
          const value = input.getAttribute('value')

          // Check if the input has a name attribute,
          // This would exclude the copy and paste section textarea
          if (name) expect(value).toBe('')
        })
      })

      test('should show history fab on form clear', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')

        expect(screen.queryByTestId('historyFab')).toBeNull()

        const clearButton = screen.getByText('Clear Form')
        await user.click(clearButton)

        expect(screen.getByTestId('historyFab')).toBeDefined()
      })

      test('clicking history fab should render history panel', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')

        const clearButton = screen.getByText('Clear Form')
        await user.click(clearButton)

        expect(screen.queryByTestId('calcHistory')).toBeNull()

        const historyFab = screen.getByTestId('historyFab')
        await user.click(historyFab)

        expect(screen.getByTestId('calcHistory')).toBeDefined()
      })

      test('history panel should render item name and dps values', async () => {
        const { user } = setup(<DpsCalc />)

        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')

        await user.type(aps, '1.4')
        await user.type(physMin, '10')
        await user.type(physMax, '20')

        const clearButton = screen.getByText('Clear Form')
        await user.click(clearButton)

        const historyFab = screen.getByTestId('historyFab')
        await user.click(historyFab)

        expect(screen.getByText('Manual')).toBeDefined()
        expect(screen.getByText('Calculation')).toBeDefined()
        expect(screen.getByText('TOTAL DPS: 21.00')).toBeDefined()
      })
    })
  })
})
