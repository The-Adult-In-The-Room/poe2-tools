import { render, screen, within } from '@testing-library/react'
import CalcHistory from './CalcHistory'
import type { HistoricCalculation } from 'types'
import { setup } from 'utils/testUtils'

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
  test('should render the Fab button', () => {
    render(<CalcHistory calcs={calcs} />)

    expect(screen.getByTestId('historyFab')).toBeDefined()
  })

  test('should not render the calcHistory container by default', () => {
    render(<CalcHistory calcs={calcs} />)

    expect(screen.queryByTestId('calcHistory')).toBeNull()
  })

  test('should render the calcHistory container when the fab is clicked', async () => {
    const { user } = setup(<CalcHistory calcs={calcs} />)

    const fab = screen.getByTestId('historyFab')
    await user.click(fab)

    expect(screen.getByTestId('calcHistory')).toBeDefined()
  })

  test('should close the calcHistory container when the fab is clicked again', async () => {
    const { user } = setup(<CalcHistory calcs={calcs} />)

    expect(screen.queryByTestId('calcHistory')).toBeNull()

    const fab = screen.getByTestId('historyFab')
    await user.click(fab)
    expect(screen.getByTestId('calcHistory')).toBeDefined()

    await user.click(fab)
    expect(screen.queryByTestId('calcHistory')).toBeNull()
  })

  test('should render the item name section with defaults when itemName isnt provided', async () => {
    const { user } = setup(<CalcHistory calcs={calcs} />)

    const fab = screen.getByTestId('historyFab')
    await user.click(fab)

    const calcItem = screen.getAllByTestId('calcHistory-item')[0]

    expect(within(calcItem).getByText('Manual')).toBeDefined()
    expect(within(calcItem).getByText('Calculation')).toBeDefined()
  })

  test('should render the item name section with provided values', async () => {
    const { user } = setup(<CalcHistory calcs={calcs} />)

    const fab = screen.getByTestId('historyFab')
    await user.click(fab)

    const calcItem = screen.getAllByTestId('calcHistory-item')[1]

    expect(within(calcItem).getByText('Test')).toBeDefined()
    expect(within(calcItem).getByText('Item')).toBeDefined()
  })

  test('should display the totalDps value', async () => {
    const { user } = setup(<CalcHistory calcs={calcs} />)

    const fab = screen.getByTestId('historyFab')
    await user.click(fab)

    const calcItem1 = screen.getAllByTestId('calcHistory-item')[0]
    const calcItem2 = screen.getAllByTestId('calcHistory-item')[1]

    expect(within(calcItem1).getByText('TOTAL DPS: 100.00')).toBeDefined()
    expect(within(calcItem2).getByText('TOTAL DPS: 90.00')).toBeDefined()
  })

  test('should display the dps values for each damage type', async () => {
    const { user } = setup(<CalcHistory calcs={calcs} />)

    const fab = screen.getByTestId('historyFab')
    await user.click(fab)

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
