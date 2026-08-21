import { render, screen, within } from '@testing-library/react'
import { TESTDATA } from '#/data/testData'
import { setup } from '#/utils/testUtils'
import DpsCalc from './DpsCalc'

describe('<DpsCalc />', () => {
  describe('copy and paste section', () => {
    describe('GIVEN the DpsCalc component is rendered', () => {
      beforeEach(() => {
        render(<DpsCalc />)
      })

      test('THEN the header is displayed', () => {
        expect(screen.getByText('Copy and Paste Entry')).toBeDefined()
      })

      test('THEN the text area is displayed', () => {
        expect(
          screen.getByPlaceholderText('CTRL + C on your weapon in-game and then CTRL + V into this area.'),
        ).toBeDefined()
      })

      test('THEN the clear button is displayed', () => {
        expect(screen.getByText('Clear')).toBeDefined()
      })
    })

    describe('GIVEN the DpsCalc component is rendered WHEN an item is pasted', () => {
      beforeEach(async () => {
        const { user } = setup(<DpsCalc />)
        const textArea = screen.getByPlaceholderText(
          'CTRL + C on your weapon in-game and then CTRL + V into this area.',
        )
        await user.click(textArea)
        await user.paste(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)
      })

      test('THEN the calculated dps is displayed', () => {
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

      test('THEN the item name is displayed', () => {
        expect(screen.getByTestId('itemName')).toBeDefined()
        expect(screen.getByText('Woe Goad')).toBeDefined()
        expect(screen.getByText('Expert Barrier Quarterstaff')).toBeDefined()
      })

      test('THEN the text fields are set to derived values', () => {
        const aps = screen.getByLabelText('Attacks Per Second *')
        const physMin = screen.getByLabelText('physical Min')
        const physMax = screen.getByLabelText('physical Max')
        const fireMin = screen.getByLabelText('fire Min')
        const fireMax = screen.getByLabelText('fire Max')
        const lightningMin = screen.getByLabelText('lightning Min')
        const lightningMax = screen.getByLabelText('lightning Max')

        expect(aps.getAttribute('value')).toBe('1.40')
        expect(physMin.getAttribute('value')).toBe('125')
        expect(physMax.getAttribute('value')).toBe('209')
        expect(fireMin.getAttribute('value')).toBe('3')
        expect(fireMax.getAttribute('value')).toBe('7')
        expect(lightningMin.getAttribute('value')).toBe('3')
        expect(lightningMax.getAttribute('value')).toBe('150')
      })
    })

    describe('GIVEN an item is pasted WHEN the Clear button is clicked', () => {
      test('THEN the form is cleared', async () => {
        const { user } = setup(<DpsCalc />)

        const textArea = screen.getByPlaceholderText(
          'CTRL + C on your weapon in-game and then CTRL + V into this area.',
        )
        await user.click(textArea)
        await user.paste(TESTDATA.FULL_ITEMS.PHYSICAL_AND_ELEMENTS)
        expect(screen.getByTestId('calculationResults')).toBeDefined()

        const clearButton = screen.getByText('Clear')
        await user.click(clearButton)

        expect(screen.queryByTestId('calculationResults')).toBeNull()

        const formInputs = screen.getAllByRole('textbox')
        formInputs.forEach((input) => {
          if (input.getAttribute('name')) expect(input.getAttribute('value')).toBe('')
        })

        expect(screen.getByTestId('pasteArea').getAttribute('value')).toBe(null)
      })
    })
  })

  describe('manual calculation section', () => {
    describe('GIVEN the DpsCalc component is rendered', () => {
      beforeEach(() => {
        render(<DpsCalc />)
      })

      test('THEN the header is displayed', () => {
        expect(screen.getByText('Manual Calculation Entry')).toBeDefined()
      })

      test('THEN the attacks per second input is displayed', () => {
        expect(screen.getByLabelText('Attacks Per Second *')).toBeDefined()
      })

      test('THEN the damage type inputs are displayed', () => {
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

      test('THEN the clear form button is displayed', () => {
        expect(screen.getByText('Clear Form')).toBeDefined()
      })

      test('THEN the history fab is not displayed', () => {
        expect(screen.queryByTestId('historyFab')).toBeNull()
      })
    })

    describe('GIVEN the DpsCalc component is rendered WHEN values are entered', () => {
      test('THEN the calculated dps is displayed', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '10')
        await user.type(screen.getByLabelText('physical Max'), '20')

        const physCard = screen.getByTestId('physicalDps')
        expect(within(physCard).getByText('21.00')).toBeDefined()
        expect(screen.getByText('TOTAL DPS: 21.00')).toBeDefined()
      })

      test('THEN the item name is not displayed', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '10')
        await user.type(screen.getByLabelText('physical Max'), '20')

        expect(screen.queryByTestId('itemName')).toBeNull()
        expect(screen.getByText('TOTAL DPS: 21.00')).toBeDefined()
      })

      test('THEN multiple damage types are handled', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '10')
        await user.type(screen.getByLabelText('physical Max'), '20')
        await user.type(screen.getByLabelText('fire Min'), '5')
        await user.type(screen.getByLabelText('fire Max'), '15')
        await user.type(screen.getByLabelText('cold Min'), '2')
        await user.type(screen.getByLabelText('cold Max'), '8')
        await user.type(screen.getByLabelText('lightning Min'), '3')
        await user.type(screen.getByLabelText('lightning Max'), '12')
        await user.type(screen.getByLabelText('chaos Min'), '1')
        await user.type(screen.getByLabelText('chaos Max'), '4')

        expect(within(screen.getByTestId('physicalDps')).getByText('21.00')).toBeDefined()
        expect(within(screen.getByTestId('fireDps')).getByText('14.00')).toBeDefined()
        expect(within(screen.getByTestId('coldDps')).getByText('7.00')).toBeDefined()
        expect(within(screen.getByTestId('lightningDps')).getByText('10.50')).toBeDefined()
        expect(within(screen.getByTestId('chaosDps')).getByText('3.50')).toBeDefined()
        expect(within(screen.getByTestId('elementalDps')).getByText('31.50')).toBeDefined()
        expect(screen.getByText('TOTAL DPS: 56.00')).toBeDefined()
      })

      test('THEN no cards are rendered with 0 total dps', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '0')
        await user.type(screen.getByLabelText('physical Max'), '0')

        expect(screen.queryByTestId('physicalDps')).toBeNull()
        expect(screen.queryByTestId('fireDps')).toBeNull()
        expect(screen.queryByTestId('coldDps')).toBeNull()
        expect(screen.queryByTestId('lightningDps')).toBeNull()
        expect(screen.queryByTestId('chaosDps')).toBeNull()
        expect(screen.queryByTestId('totalDps')).toBeNull()
      })

      test('THEN individual cards with 0 dps are not rendered', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '0')
        await user.type(screen.getByLabelText('physical Max'), '0')
        await user.type(screen.getByLabelText('fire Min'), '3')
        await user.type(screen.getByLabelText('fire Max'), '5')
        await user.type(screen.getByLabelText('cold Min'), '0')
        await user.type(screen.getByLabelText('cold Max'), '0')
        await user.type(screen.getByLabelText('lightning Min'), '2')
        await user.type(screen.getByLabelText('lightning Max'), '4')
        await user.type(screen.getByLabelText('chaos Min'), '0')
        await user.type(screen.getByLabelText('chaos Max'), '0')

        expect(screen.queryByTestId('physicalDps')).toBeNull()
        expect(screen.getByTestId('fireDps')).toBeDefined()
        expect(screen.queryByTestId('coldDps')).toBeNull()
        expect(screen.getByTestId('lightningDps')).toBeDefined()
        expect(screen.queryByTestId('chaosDps')).toBeNull()
        expect(screen.getByTestId('totalDps')).toBeDefined()
      })
    })

    describe('GIVEN values are entered WHEN the Clear Form button is clicked', () => {
      test('THEN the form is cleared', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '10')
        await user.type(screen.getByLabelText('physical Max'), '20')
        expect(screen.getByTestId('calculationResults')).toBeDefined()

        await user.click(screen.getByText('Clear Form'))

        expect(screen.queryByTestId('calculationResults')).toBeNull()

        const formInputs = screen.getAllByRole('textbox')
        formInputs.forEach((input) => {
          if (input.getAttribute('name')) expect(input.getAttribute('value')).toBe('')
        })
      })

      test('THEN the history fab is displayed', async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '10')
        await user.type(screen.getByLabelText('physical Max'), '20')
        expect(screen.queryByTestId('historyFab')).toBeNull()

        await user.click(screen.getByText('Clear Form'))

        expect(screen.getByTestId('historyFab')).toBeDefined()
      })
    })

    describe('GIVEN the form is cleared WHEN the history fab is clicked', () => {
      beforeEach(async () => {
        const { user } = setup(<DpsCalc />)

        await user.type(screen.getByLabelText('Attacks Per Second *'), '1.4')
        await user.type(screen.getByLabelText('physical Min'), '10')
        await user.type(screen.getByLabelText('physical Max'), '20')
        await user.click(screen.getByText('Clear Form'))
        await user.click(screen.getByTestId('historyFab'))
      })

      test('THEN the history panel is displayed', () => {
        expect(screen.getByTestId('calcHistory')).toBeDefined()
      })

      test('THEN the item name and dps values are displayed', () => {
        expect(screen.getByText('Manual')).toBeDefined()
        expect(screen.getByText('Calculation')).toBeDefined()
        expect(screen.getByText('TOTAL DPS: 21.00')).toBeDefined()
      })
    })
  })
})
