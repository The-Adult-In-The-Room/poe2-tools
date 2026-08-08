import { createRef, useState } from 'react'
import { CalcHistory, Card, Input, Typography } from '#/components'
import { allDmgTypes, dpsCalcInitialCalculations, dpsCalcInitialFormValues } from '#/data/constants'
import type { Calculations, FormKeys, FormValues, HistoricCalculation } from '#/types'
import { createCards, findItemName, findStatValues, handleDpsCalculations } from '#/utils'

const DpsCalc = (): React.JSX.Element => {
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [calculations, setCalculations] = useState<Calculations>(dpsCalcInitialCalculations)
  const [formValues, setFormValues] = useState<FormValues>(dpsCalcInitialFormValues)
  const [historicCalculations, setHistoricCalculations] = useState<HistoricCalculation[]>([])
  const formRef = createRef<HTMLFormElement>()

  const createHistoricItem = () => {
    const itemName = findItemName(textAreaValue)
    const newHistoricItem: HistoricCalculation = {
      ...calculations,
      id: crypto.randomUUID(),
      itemName,
    }

    setHistoricCalculations((prev) => [newHistoricItem, ...prev])
  }

  const onReset = (): void => {
    setCalculations(dpsCalcInitialCalculations)
    setTextAreaValue('')
    setFormValues(dpsCalcInitialFormValues)
    createHistoricItem()
    formRef.current?.reset()
  }

  const onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextAreaValue(event.target.value)
    const lines = event.target.value.split('\n')
    const stats = findStatValues(lines)

    setFormValues((prev) => ({ ...prev, ...stats }))
    const calcs = handleDpsCalculations(stats)
    setCalculations(calcs)
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target

    setFormValues((prev) => ({ ...prev, [id]: value }))
    const calcs = handleDpsCalculations({ ...formValues, [id]: value })
    setCalculations(calcs)
  }

  const itemName = findItemName(textAreaValue)
  const cardsToDisplay = createCards(calculations)

  return (
    <div data-testid="dpsCalc" className="flex flex-col px-4">
      <div className="flex flex-col mb-16">
        <Typography variant="title">Copy and Paste Entry</Typography>
        <hr />

        <textarea
          value={textAreaValue.trim()}
          onChange={onTextAreaChange}
          placeholder="CTRL + C on your weapon in-game and then CTRL + V into this area."
          data-testid="pasteArea"
        />

        <button type="button" onClick={onReset} className="self-end bg-transparent">
          <Typography variant="clear">Clear</Typography>
        </button>
      </div>

      <Typography variant="title">Manual Calculation Entry</Typography>
      <hr />

      <div className="relative flex flex-col gap-4 md:flex-row md:gap-16">
        <form ref={formRef} className="flex flex-col gap-4">
          <Input
            id="aps"
            label="Attacks Per Second"
            placeholder="Attacks Per Second..."
            required
            value={formValues.aps}
            onChange={onChange}
          />

          {allDmgTypes.map((type) => {
            const minId = `${type}Min` as FormKeys
            const maxId = `${type}Max` as FormKeys

            return (
              <div key={type} className="flex gap-4 justify-between md:justify-start">
                <Input
                  className="max-w-[185px]"
                  id={minId}
                  label={`${type} Min`}
                  placeholder="Min Damage..."
                  value={formValues[minId]}
                  onChange={onChange}
                />
                <Input
                  className="max-w-[185px]"
                  id={maxId}
                  label={`${type} Max`}
                  placeholder="Max Damage..."
                  value={formValues[maxId]}
                  onChange={onChange}
                />
              </div>
            )
          })}

          <button type="button" onClick={onReset} className="self-end bg-transparent">
            <Typography variant="clear">Clear Form</Typography>
          </button>
        </form>

        {calculations.totalDps ? (
          <>
            {itemName && (
              <div className="min-w-[200px]" data-testid="itemName">
                <h3>{itemName[0]}</h3>
                <h4>{itemName[1]}</h4>
              </div>
            )}
            <div className="flex flex-col w-full gap-4" data-testid="calculationResults">
              <div className="max-h-[34px] py-2 px-4 bg-primary-a50 rounded-lg" data-testid="totalDps">
                <p className="text-dark-a0 text-sm font-semibold">TOTAL DPS: {calculations.totalDps.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-between">
                {cardsToDisplay.map(({ label, value, color, testId }) => (
                  <div key={label} className="md:w-[calc(50%-1rem)] md:min-w-[250px]">
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
