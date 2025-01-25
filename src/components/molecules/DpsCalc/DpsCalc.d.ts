interface DpsCalcFormElements extends HTMLFormControlsCollection {
  aps: HTMLInputElement
  physicalMin: HTMLInputElement
  physicalMax: HTMLInputElement
  lightningMin: HTMLInputElement
  lightningMax: HTMLInputElement
  fireMin: HTMLInputElement
  fireMax: HTMLInputElement
  coldMin: HTMLInputElement
  coldMax: HTMLInputElement
  chaosMin: HTMLInputElement
  chaosMax: HTMLInputElement
}

export interface DpsCalcFormElement extends HTMLFormElement {
  readonly elements: DpsCalcFormElements
}
export type Physical = 'physical'
export type Chaos = 'chaos'
export type Lightning = 'lightning'
export type Fire = 'fire'
export type Cold = 'cold'

export type Elemental = Lightning | Fire | Cold
export type DamageType = Physical | Elemental | Chaos

export type AllElementalTypes = [Lightning, Fire, Cold]
export type AllOtherTypes = [Physical, Chaos]
export type AllDamageTypes = [Physical, Lightning, Fire, Cold, Chaos]

export interface DamageTypeCalc {
  min: number
  max: number
  dps: number
}

export type ElementalTypeCalculations = {
  [key in Elemental]: DamageTypeCalc
}

export type DamageTypeCalculations = {
  [key in DamageType]: DamageTypeCalc
}

export type TotalCalculations = {
  totalDps: number
  totalElementalDps: number
}

export type Calculations = DamageTypeCalculations & TotalCalculations
