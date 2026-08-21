import { render, screen, within } from '@testing-library/react'
import type { HistoricCalculation } from '#/types'
import { setup } from '#/utils/testUtils'
import CalcHistory from './CalcHistory'

const calcs: HistoricCalculation[] = [
  {
    totalDps: 100,
    totalElementalDps: 50,
    physical: { min: 10, max: 20, dps: 15 },
    lightning: { min: 10, max: 20, dps: 15 },
    fire: { min: 10, max: 20, dps: 15 },
    cold: { min: 10, max: 20, dps: 15 },
    chaos: { min: 10, max: 20, dps: 15 },
    id: '1',
  },
  {
    totalDps: 90,
    totalElementalDps: 60,
    physical: { min: 0, max: 0, dps: 0 },
    lightning: { min: 20, max: 40, dps: 30 },
    fire: { min: 0, max: 0, dps: 0 },
    cold: { min: 20, max: 40, dps: 30 },
    chaos: { min: 20, max: 40, dps: 30 },
    id: '2',
    itemName: ['Test', 'Item'],
  },
]

describe('<CalcHistory />', () => {
  describe('GIVEN the CalcHistory component is rendered', () => {
    beforeEach(() => {
      render(<CalcHistory calcs={calcs} />)
    })

    test('THEN the Fab button is displayed', () => {
      expect(screen.getByTestId('historyFab')).toBeDefined()
    })

    test('THEN the calcHistory container is not displayed', () => {
      expect(screen.queryByTestId('calcHistory')).toBeNull()
    })
  })

  describe('GIVEN the CalcHistory component is rendered WHEN the fab is clicked', () => {
    beforeEach(async () => {
      const { user } = setup(<CalcHistory calcs={calcs} />)
      const fab = screen.getByTestId('historyFab')
      await user.click(fab)
    })

    test('THEN the calcHistory container is displayed', () => {
      expect(screen.getByTestId('calcHistory')).toBeDefined()
    })

    test('THEN the item name section displays defaults when itemName is not provided', () => {
      const calcItem = screen.getAllByTestId('calcHistory-item')[0]
      expect(within(calcItem).getByText('Manual')).toBeDefined()
      expect(within(calcItem).getByText('Calculation')).toBeDefined()
    })

    test('THEN the item name section displays provided values', () => {
      const calcItem = screen.getAllByTestId('calcHistory-item')[1]
      expect(within(calcItem).getByText('Test')).toBeDefined()
      expect(within(calcItem).getByText('Item')).toBeDefined()
    })

    test('THEN the totalDps value is displayed for each item', () => {
      const calcItem1 = screen.getAllByTestId('calcHistory-item')[0]
      const calcItem2 = screen.getAllByTestId('calcHistory-item')[1]
      expect(within(calcItem1).getByText('TOTAL DPS: 100.00')).toBeDefined()
      expect(within(calcItem2).getByText('TOTAL DPS: 90.00')).toBeDefined()
    })

    test('THEN the dps values for each damage type are displayed', () => {
      const calcItem1 = screen.getAllByTestId('calcHistory-item')[0]
      const physicalDps1 = within(calcItem1).getByTestId('1-physicalDps')
      const lightningDps1 = within(calcItem1).getByTestId('1-lightningDps')
      const fireDps1 = within(calcItem1).getByTestId('1-fireDps')
      const coldDps1 = within(calcItem1).getByTestId('1-coldDps')
      const chaosDps1 = within(calcItem1).getByTestId('1-chaosDps')

      expect(within(physicalDps1).getByText('15.00')).toBeDefined()
      expect(within(lightningDps1).getByText('15.00')).toBeDefined()
      expect(within(fireDps1).getByText('15.00')).toBeDefined()
      expect(within(coldDps1).getByText('15.00')).toBeDefined()
      expect(within(chaosDps1).getByText('15.00')).toBeDefined()

      const calcItem2 = screen.getAllByTestId('calcHistory-item')[1]
      const lightningDps2 = within(calcItem2).getByTestId('2-lightningDps')
      const coldDps = within(calcItem2).getByTestId('2-coldDps')
      const chaosDps = within(calcItem2).getByTestId('2-chaosDps')

      expect(within(lightningDps2).getByText('30.00')).toBeDefined()
      expect(within(coldDps).getByText('30.00')).toBeDefined()
      expect(within(chaosDps).getByText('30.00')).toBeDefined()
    })
  })

  describe('GIVEN the calcHistory container is open WHEN the fab is clicked again', () => {
    test('THEN the calcHistory container is closed', async () => {
      const { user } = setup(<CalcHistory calcs={calcs} />)

      const fab = screen.getByTestId('historyFab')
      await user.click(fab)
      expect(screen.getByTestId('calcHistory')).toBeDefined()

      await user.click(fab)
      expect(screen.queryByTestId('calcHistory')).toBeNull()
    })
  })
})
