import { createRef, useState } from 'react'
import { Input, Typography } from '../../atoms'
import { Card } from '../../molecules'
import type { CardColors } from '../../../types'
import type {
  DamageTypeCalc,
  AllDamageTypes,
  DamageType,
  FormValues,
  FormKeys,
  Calculations,
} from './DpsCalc.d'
import * as classes from './DpsCalc.module.css'
import { findItemName, removeKey, removeSuffix } from '../../../utils/utils'

/**
 * Each damage type has a section containing min and max inputs.
 */
const allTypes: AllDamageTypes = [
  'physical',
  'lightning',
  'fire',
  'cold',
  'chaos',
]

const initialCalculations: Calculations = {
  physical: { min: 0, max: 0, dps: 0 },
  lightning: { min: 0, max: 0, dps: 0 },
  fire: { min: 0, max: 0, dps: 0 },
  cold: { min: 0, max: 0, dps: 0 },
  chaos: { min: 0, max: 0, dps: 0 },
  totalDps: 0,
  totalElementalDps: 0,
}

const initialFormValues: FormValues = {
  aps: '',
  physicalMin: '',
  physicalMax: '',
  lightningMin: '',
  lightningMax: '',
  fireMin: '',
  fireMax: '',
  coldMin: '',
  coldMax: '',
  chaosMin: '',
  chaosMax: '',
}

/**
 * Damage Per Second Calculator component.
 */
const DpsCalc = (): React.JSX.Element => {
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [calculations, setCalculations] =
    useState<Calculations>(initialCalculations)
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
  const formRef = createRef<HTMLFormElement>()

  /**
   * Calculate DPS for each damage type and update state
   */
  const handleCalculations = (input: FormValues): void => {
    const aps = Number(input.aps) || 1

    // Calculate DPS for each damage type
    const damageTypeCalcs = allTypes.map((type: DamageType): DamageTypeCalc => {
      const min = Number(input[`${type}Min`]) || 0
      const max = Number(input[`${type}Max`]) || 0
      return { min, max, dps: ((min + max) / 2) * aps }
    })
    const totalDps = damageTypeCalcs.reduce((acc, { dps }) => acc + dps, 0)
    const [physical, lightning, fire, cold, chaos] = damageTypeCalcs
    const totalElementalDps = lightning.dps + fire.dps + cold.dps

    setCalculations({
      physical,
      lightning,
      fire,
      cold,
      chaos,
      totalDps,
      totalElementalDps,
    })
  }

  /**
   * Reset form state and calculations
   */
  const onReset = (): void => {
    setCalculations(initialCalculations)
    setTextAreaValue('')
    setFormValues(initialFormValues)
    formRef.current?.reset()
  }

  /**
   * Derives stat values from the text area input
   */
  const findStatValues = (lines: string[]): FormValues => {
    const filters = {
      aps: 'Attacks per Second',
      physical: 'Physical Damage',
      lightning: 'Lightning Damage',
      fire: 'Fire Damage',
      cold: 'Cold Damage',
      chaos: 'Chaos Damage',
    }

    const stats = new Map<FormKeys, string>()

    // Iterate the hash and find the corresponding line in the text area input
    for (const [key, value] of Object.entries(filters)) {
      const line = lines.find((line) => line.includes(value))

      // Sanitize the value to remove any non-numeric characters
      const sanitized = removeSuffix(removeKey(line))
      if (!sanitized) continue

      // If the key is 'aps', set the value directly
      // Otherwise, split the value into min and max values
      if (key === 'aps') {
        stats.set(key, sanitized)
      } else {
        const [min, max] = sanitized.split('-')
        // @ts-expect-error
        stats.set(`${key}Min`, min)
        // @ts-expect-error
        stats.set(`${key}Max`, max)
      }
    }

    return Object.fromEntries(stats)
  }

  /**
   * Updates text area input state + calculations
   */
  const onTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTextAreaValue(event.target.value)
    const lines = event.target.value.split('\n')
    const stats = findStatValues(lines)

    setFormValues(stats)
    handleCalculations(stats)
  }

  /**
   * Update form state and calculations
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = event.target

    setFormValues((prev) => ({ ...prev, [id]: value }))
    handleCalculations({ ...formValues, [id]: value })
  }

  const itemName = findItemName(textAreaValue)

  const cards: { label: string; value: number; color: CardColors }[] = [
    { label: 'Physical DPS:', value: calculations.physical.dps, color: 'cyan' },
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

  const cardsToDisplay = cards.filter(({ value }) => value > 0)

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

          {allTypes.map((type: DamageType): React.JSX.Element => {
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

          <button
            type="button"
            onClick={onReset}
            className={classes.clearButton}
          >
            <Typography variant="clear">Clear Form</Typography>
          </button>
        </form>

        {calculations.totalDps ? (
          <div className={classes.summaryContainer}>
            {itemName && (
              <>
                <h3>{itemName[0]}</h3>
                <h4>{itemName[1]}</h4>
              </>
            )}

            <div className={classes.totalDps}>
              <p>TOTAL DPS: {calculations.totalDps.toFixed(2)}</p>
            </div>

            {cardsToDisplay.map(({ label, value, color }) => (
              <Card key={label} color={color}>
                <Typography variant="cardTitle">{label}</Typography>
                <Typography variant="card">{value.toFixed(2)}</Typography>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default DpsCalc
