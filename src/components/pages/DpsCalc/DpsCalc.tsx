import { createRef, useState } from 'react'
import { Card, Typography, Input } from 'components'
import { findItemName, findStatValues, handleDpsCalculations } from 'utils'
import { allDmgTypes, dpsCalcInitialCalculations, dpsCalcInitialFormValues } from 'data/constants'
import type { CardColors, FormValues, Calculations } from 'types'

import * as classes from './DpsCalc.module.css'

/**
 * Damage Per Second Calculator component.
 */
const DpsCalc = (): React.JSX.Element => {
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [calculations, setCalculations] = useState<Calculations>(dpsCalcInitialCalculations)
  const [formValues, setFormValues] = useState<FormValues>(dpsCalcInitialFormValues)
  const formRef = createRef<HTMLFormElement>()

  /**
   * Reset form state and calculations
   */
  const onReset = (): void => {
    setCalculations(dpsCalcInitialCalculations)
    setTextAreaValue('')
    setFormValues(dpsCalcInitialFormValues)
    formRef.current?.reset()
  }

  /**
   * Updates text area input state + calculations
   */
  const onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextAreaValue(event.target.value)
    const lines = event.target.value.split('\n')
    const stats = findStatValues(lines)

    setFormValues((prev) => ({ ...prev, ...stats }))
    const calcs = handleDpsCalculations(stats)
    setCalculations(calcs)
  }

  /**
   * Update form state and calculations
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target

    setFormValues((prev) => ({ ...prev, [id]: value }))
    const calcs = handleDpsCalculations({ ...formValues, [id]: value })
    setCalculations(calcs)
  }

  /**
   * Create and filters cards to display for each damage type
   * Only display cards with a value greater than 0
   */
  const createCards = () => {
    const cards: { label: string; value: number; color: CardColors }[] = [
      {
        label: 'Physical DPS:',
        value: calculations.physical.dps,
        color: 'cyan',
      },
      {
        label: 'Elemental DPS:',
        value: calculations.totalElementalDps,
        color: 'cyan',
      },
      {
        label: 'Lightning DPS:',
        value: calculations.lightning.dps,
        color: 'yellow',
      },
      { label: 'Fire DPS:', value: calculations.fire.dps, color: 'red' },
      { label: 'Cold DPS:', value: calculations.cold.dps, color: 'blue' },
      { label: 'Chaos DPS:', value: calculations.chaos.dps, color: 'pink' },
    ]

    return cards.filter(({ value }) => value > 0)
  }

  const itemName = findItemName(textAreaValue)
  const cardsToDisplay = createCards()

  return (
    <div className={classes.container}>
      <div className={classes.textAreaWrapper}>
        <Typography variant="title">Copy and Paste Entry</Typography>
        <hr />

        <textarea
          value={textAreaValue}
          onChange={onTextAreaChange}
          placeholder="CTRL + C on your weapon in-game and then CTRL + V into this area."
        />

        <button type="button" onClick={onReset} className={classes.clearButton}>
          <Typography variant="clear">Clear</Typography>
        </button>
      </div>

      <Typography variant="title">Manual Calculation Entry</Typography>
      <hr />

      <div className={classes.formWrapper}>
        <form ref={formRef} className={classes.form}>
          <Input
            id="aps"
            label="Attacks Per Second"
            placeholder="Attacks Per Second..."
            required
            value={formValues.aps}
            onChange={onChange}
          />

          {allDmgTypes.map((type) => {
            const minId = `${type}Min`
            const maxId = `${type}Max`

            return (
              <div key={type} className={classes.row}>
                <Input
                  className={classes.input}
                  id={minId}
                  label={`${type} Min`}
                  placeholder="Min Damage..."
                  value={formValues[minId]}
                  onChange={onChange}
                />
                <Input
                  className={classes.input}
                  id={maxId}
                  label={`${type} Max`}
                  placeholder="Max Damage..."
                  value={formValues[maxId]}
                  onChange={onChange}
                />
              </div>
            )
          })}

          <button type="button" onClick={onReset} className={classes.clearButton}>
            <Typography variant="clear">Clear Form</Typography>
          </button>
        </form>

        {calculations.totalDps ? (
          <>
            {itemName && (
              <div>
                <h3>{itemName[0]}</h3>
                <h4>{itemName[1]}</h4>
              </div>
            )}
            <div className={classes.summaryContainer}>
              <div className={classes.totalDps}>
                <p>TOTAL DPS: {calculations.totalDps.toFixed(2)}</p>
              </div>

              <div className={classes.summaryCards}>
                {cardsToDisplay.map(({ label, value, color }) => (
                  <div key={label}>
                    <Card key={label} color={color}>
                      <Typography variant="cardTitle">{label}</Typography>
                      <Typography variant="card">{value.toFixed(2)}</Typography>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default DpsCalc
