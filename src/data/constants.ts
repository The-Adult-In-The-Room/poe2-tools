import type { AllDamageTypes, Calculations, FormValues, NavLink } from '#/types'

/**
 * Each damage type has a section containing min and max inputs.
 */
export const allDmgTypes: AllDamageTypes = ['physical', 'lightning', 'fire', 'cold', 'chaos']

export const dpsCalcInitialCalculations: Calculations = {
  physical: { min: 0, max: 0, dps: 0 },
  lightning: { min: 0, max: 0, dps: 0 },
  fire: { min: 0, max: 0, dps: 0 },
  cold: { min: 0, max: 0, dps: 0 },
  chaos: { min: 0, max: 0, dps: 0 },
  totalDps: 0,
  totalElementalDps: 0,
}

export const dpsCalcInitialFormValues: FormValues = {
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

export const internalLinks: NavLink[] = [{ href: '/', label: 'Weapon DPS Calculator' }]

export const externalLinks: NavLink[] = [
  { href: 'https://pathofbuilding.community/', label: 'Path of Building' },
  { href: 'https://mobalytics.gg/poe-2/builds', label: 'Mobalytics Builds' },
]
