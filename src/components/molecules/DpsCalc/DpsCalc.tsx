import { createRef, useState } from 'react'
import { Input } from '../../atoms'
import type {
  DpsCalcFormElement,
  DamageTypeCalc,
  AllDamageTypes,
  DamageType,
  FormValues,
  FormKeys,
  Calculations,
} from './DpsCalc.d'
import * as classes from './DpsCalc.module.css'

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

/**
 * Removes the key from a line of text.
 * Example: 'Attacks per Second: 1.5' -> '1.5'
 */
const removeKey = (line?: string): string | undefined =>
  line?.split(':')[1].trim()

/**
 * Removes the suffix from a line of text.
 * Example: '12-15 (Augmented)' -> '12-15'
 */
const removeSuffix = (line?: string): string | undefined => line?.split(' ')[0]

/**
 * Derives the item name and type from the text area input.
 */
const findItemName = (textAreaValue: string): [string, string] | null => {
  const lines = textAreaValue.split('\n')
  if (lines.length < 4) return null

  return [lines[2], lines[3]]
}

/**
 * Damage Per Second Calculator component.
 */
const DpsCalc = (): React.JSX.Element => {
  const [textAreaValue, setTextAreaValue] = useState<string>('')
  const [calculations, setCalculations] =
    useState<Calculations>(initialCalculations)
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
    const totalDps = damageTypeCalcs.reduce(
      (acc: number, { dps }: DamageTypeCalc): number => acc + dps,
      0
    )
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

  const onSubmit = (event: React.FormEvent<DpsCalcFormElement>): void => {
    // Prevent form from being reset
    event.preventDefault()

    // Convert form data to object
    const formData = new FormData(event.target as DpsCalcFormElement)
    const form: FormValues = Object.fromEntries(formData.entries())

    handleCalculations(form)
  }

  /**
   * Reset form state and calculations
   */
  const onReset = (): void => {
    setCalculations(initialCalculations)
    setTextAreaValue('')
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
      const line = lines.find((line: string): boolean => line.includes(value))

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

  // Manages text area input state + calculations
  const onTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTextAreaValue(event.target.value)
    const lines = event.target.value.split('\n')
    const stats = findStatValues(lines)

    handleCalculations(stats)
  }

  const itemName = findItemName(textAreaValue)

  return (
    <div className={classes.container}>
      <h2>DAMAGE PER SECOND CALCULATOR</h2>
      <p>
        Copy & Paste weapon stats from in-game here, or manually enter below.
      </p>
      <textarea value={textAreaValue} onChange={onTextAreaChange} />

      <hr />
      <div className={classes.row}>
        <form ref={formRef} onSubmit={onSubmit} className={classes.form}>
          <Input
            className={classes.input}
            name="aps"
            id="aps"
            label="Attacks / Second"
            placeholder="1.0"
            type="number"
            required
          />

          {allTypes.map(
            (type: DamageType): React.JSX.Element => (
              <div key={type}>
                <h3>
                  {type} ({calculations[type].dps.toFixed(2)} dps)
                </h3>

                <div className={classes.row}>
                  <Input
                    className={classes.input}
                    id={`${type}Min`}
                    name={`${type}Min`}
                    label="Min"
                    placeholder="0"
                    type="number"
                    min={0}
                  />
                  <Input
                    className={classes.input}
                    id={`${type}Max`}
                    name={`${type}Max`}
                    label="Max"
                    placeholder="0"
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            )
          )}

          <div className={classes.row}>
            <button type="button" onClick={onReset}>
              Reset
            </button>
            <button type="submit">Calculate</button>
          </div>
        </form>

        <div>
          {itemName && (
            <>
              <h3>{itemName[0]}</h3>
              <h3>{itemName[1]}</h3>
            </>
          )}
          <h4>Elemental: {calculations.totalElementalDps.toFixed(2)} dps</h4>
          <h4>Total: {calculations.totalDps.toFixed(2)} dps</h4>
        </div>
      </div>
    </div>
  )
}

export default DpsCalc
