import { allDmgTypes } from 'data/constants'
import type { Calculations, DamageType, DamageTypeCalc, FormValues } from 'types'

/**
 * Removes the key from a line of text.
 * Example: 'Attacks per Second: 1.5' -> '1.5'
 */
export const removeKey = (line: string): string => line.split(':')[1].trim()

/**
 * Removes the suffix from a line of text.
 * Example: '12-15 (Augmented)' -> '12-15'
 */
export const removeSuffix = (line: string): string => line.split(' ')[0]

/**
 * Handles formatting a range of values.
 * Example: 'Adds 3 to 150 Lightning Damage' -> '3-150'
 */
export const convertRangeText = (line: string): string | undefined => {
  const [start, finish] = line.split(' to ') || []
  const [_discard, min] = start.split(' ') || []
  const [max, _discard2] = finish.split(' ') || []

  if (!min || !max) return undefined

  return `${min}-${max}`
}
/**
 * Derives the item name and type from the text area input.
 */
export const findItemName = (textAreaValue: string): [string, string] | null => {
  const lines = textAreaValue.split('\n')
  if (lines.length < 4) return null

  return [lines[2], lines[3]]
}

/**
 * Derives combined elemental damage values from the text area input.
 * @example
 * Exists: 'Elemental Damage: 2-5 (augmented), 5-14 (augmented), 14-76 (augmented)'
 * Returns: ['2-5', '5-14', '14-76']
 */
export const findElementalDamageValues = (lines: string[]): string[] | undefined => {
  const elementalDamageLine = lines.find((line) => line.includes('Elemental Damage:'))
  if (!elementalDamageLine) return undefined

  const keyless = removeKey(elementalDamageLine)

  // Split the line by commas, sanitize suffixes, and remove any whitespace
  return keyless?.split(',').map((value) => removeSuffix(value.trim()))
}

/**
 * Sets the min and max values for a given key in the stats map.
 * @example
 * key: 'physical'
 * range: '12-15'
 *
 * {Results} statsMap: Map { 'physicalMin': '12', 'physicalMax': '15' }
 */
export const setMinMax = (key: string, range: string, statsMap: Map<string, string>) => {
  const [min, max] = range.split('-')
  statsMap.set(`${key}Min`, min)
  statsMap.set(`${key}Max`, max)
}

/**
 * Derives stat values from the text area input
 */
export const findStatValues = (lines: string[]): FormValues => {
  const stats = new Map<string, string>()

  // These are the base filters which are handled similarly
  let filters = {
    aps: 'Attacks per Second',
    physical: 'Physical Damage',
    chaos: 'Chaos Damage',
  }

  // Elemental filters _might_ be handled differently
  const elementalFilters = {
    fire: 'Fire Damage',
    cold: 'Cold Damage',
    lightning: 'Lightning Damage',
  }

  const elementalDamageValues = findElementalDamageValues(lines)

  // If we have a line containing 'Elemental Damage:', handle the elementalFilters separately
  if (elementalDamageValues) {
    let elementalIndex = 0

    // Now we have an array of min-max values for each elemental damage type
    // Need to marry these up with the correct damage type in indexed order
    for (const [key, value] of Object.entries(elementalFilters)) {
      const line = lines.find((line) => line.includes(value))
      const range = elementalDamageValues[elementalIndex]
      // Skip if we couldn't match up an elemental type with a range
      if (!line || !range) continue

      setMinMax(key, range, stats)
      elementalIndex++
    }
  } else {
    filters = { ...elementalFilters, ...filters }
  }

  // Iterate the hash and find the corresponding line in the text area input
  for (const [key, value] of Object.entries(filters)) {
    const line = lines.find((line) => line.includes(value))
    if (!line) continue

    // Sanitize the value to remove any non-numeric characters
    const sanitized = line.includes(':') ? removeSuffix(removeKey(line)) : convertRangeText(line)
    // Skip if we couldn't sanitize the value
    if (!sanitized) continue

    // If the key is 'aps', set the value directly
    // Otherwise, split the value into min and max values
    if (key === 'aps') stats.set(key, sanitized)
    else setMinMax(key, sanitized, stats)
  }

  return Object.fromEntries(stats)
}

/**
 * Calculate DPS for each damage type
 */
export const handleDpsCalculations = (input: FormValues): Calculations => {
  const aps = Number(input.aps) || 1

  // Calculate DPS for each damage type
  const damageTypeCalcs = allDmgTypes.map((type: DamageType): DamageTypeCalc => {
    const min = Number(input[`${type}Min`]) || 0
    const max = Number(input[`${type}Max`]) || 0
    return { min, max, dps: ((min + max) / 2) * aps }
  })
  const totalDps = damageTypeCalcs.reduce((acc, { dps }) => acc + dps, 0)
  const [physical, lightning, fire, cold, chaos] = damageTypeCalcs
  const totalElementalDps = lightning.dps + fire.dps + cold.dps

  return {
    physical,
    lightning,
    fire,
    cold,
    chaos,
    totalDps,
    totalElementalDps,
  }
}
