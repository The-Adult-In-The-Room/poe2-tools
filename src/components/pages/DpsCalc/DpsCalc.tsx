import { createRef, useState } from 'react'
import { Card, Typography, Input, CalcHistory } from 'components'
import { createCards, findItemName, findStatValues, handleDpsCalculations } from 'utils'
import { allDmgTypes, dpsCalcInitialCalculations, dpsCalcInitialFormValues } from 'data/constants'
import type { FormValues, Calculations, HistoricCalculation } from 'types'

import * as classes from './DpsCalc.module.css'

/**
 * Damage Per Second Calculator component.
 */
const DpsCalc = (): React.JSX.Element => {
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [calculations, setCalculations] = useState<Calculations>(dpsCalcInitialCalculations)
  const [formValues, setFormValues] = useState<FormValues>(dpsCalcInitialFormValues)
  const [historicCalculations, setHistoricCalculations] = useState<HistoricCalculation[]>([])
  const formRef = createRef<HTMLFormElement>()

  /**
   * Create a new historic item and add it to the list.
   */
  const createHistoricItem = () => {
    const itemName = findItemName(textAreaValue)
    const newHistoricItem: HistoricCalculation = {
      ...calculations,
      id: crypto.randomUUID(),
      itemName,
    }

    setHistoricCalculations((prev) => [newHistoricItem, ...prev])
  }
  /**
   * Reset form state and calculations
   */
  const onReset = (): void => {
    setCalculations(dpsCalcInitialCalculations)
    setTextAreaValue('')
    setFormValues(dpsCalcInitialFormValues)
    createHistoricItem()
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

  const itemName = findItemName(textAreaValue)
  const cardsToDisplay = createCards(calculations)

  return (
    <div data-testid="dpsCalc" className={classes.container}>
      <div className={classes.textAreaWrapper}>
        <Typography variant="title">Copy and Paste Entry</Typography>
        <hr />

        <textarea
          value={textAreaValue.trim()}
          onChange={onTextAreaChange}
          placeholder="CTRL + C on your weapon in-game and then CTRL + V into this area."
          data-testid="pasteArea"
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
              <div className={classes.itemNameContainer} data-testid="itemName">
                <h3>{itemName[0]}</h3>
                <h4>{itemName[1]}</h4>
              </div>
            )}
            <div className={classes.summaryContainer} data-testid="calculationResults">
              <div className={classes.totalDps} data-testid="totalDps">
                <p>TOTAL DPS: {calculations.totalDps.toFixed(2)}</p>
              </div>

              <div className={classes.summaryCards}>
                {cardsToDisplay.map(({ label, value, color, testId }) => (
                  <div key={label}>
                    <Card key={label} color={color} data-testid={testId}>
                      <Typography variant="cardTitle">{label}</Typography>
                      <Typography variant="card">{value.toFixed(2)}</Typography>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {historicCalculations.length ? <CalcHistory calcs={historicCalculations} /> : null}
      </div>
    </div>
  )
}

export default DpsCalc
