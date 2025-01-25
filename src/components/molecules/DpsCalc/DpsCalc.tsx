import { createRef, useState } from 'react'
import { Input } from '../../atoms'
import type {
  DpsCalcFormElement,
  DamageTypeCalc,
  Calculations,
  AllDamageTypes,
  DamageType,
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

const DpsCalc = (): React.JSX.Element => {
  const [calculations, setCalculations] =
    useState<Calculations>(initialCalculations)
  const formRef = createRef<HTMLFormElement>()

  const onSubmit = (event: React.FormEvent<DpsCalcFormElement>): void => {
    // Prevent form from being reset
    event.preventDefault()

    // Convert form data to object
    const formData = new FormData(event.target as DpsCalcFormElement)
    const form = Object.fromEntries(formData.entries())
    const aps = Number(form.aps) || 1

    // Calculate DPS for each damage type
    const damageTypeCalcs = allTypes.map((type: DamageType): DamageTypeCalc => {
      const min = Number(form[`${type}Min`])
      const max = Number(form[`${type}Max`])
      return { min, max, dps: ((min + max) / 2) * aps }
    })

    // Calculate total DPS and total elemental DPS
    const totalDps = damageTypeCalcs.reduce(
      (acc: number, { dps }: DamageTypeCalc): number => acc + dps,
      0
    )
    const [physical, lightning, fire, cold, chaos] = damageTypeCalcs
    const totalElementalDps = lightning.dps + fire.dps + cold.dps

    // Update state with results
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

  // Reset form state and calculations
  const onReset = (): void => {
    setCalculations(initialCalculations)
    formRef.current?.reset()
  }

  return (
    <div className={classes.container}>
      <h2>DAMAGE PER SECOND CALCULATOR</h2>
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

        <h3>Elemental: {calculations.totalElementalDps.toFixed(2)} dps</h3>
        <h3>Total: {calculations.totalDps.toFixed(2)} dps</h3>
      </form>
    </div>
  )
}

export default DpsCalc
