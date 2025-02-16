export type FormKeys =
  | 'aps'
  | 'physicalMin'
  | 'physicalMax'
  | 'lightningMin'
  | 'lightningMax'
  | 'fireMin'
  | 'fireMax'
  | 'coldMin'
  | 'coldMax'
  | 'chaosMin'
  | 'chaosMax'
interface DpsCalcFormElements extends HTMLFormControlsCollection {
  [key in FormKeys]: HTMLInputElement
}

export interface DpsCalcFormElement extends HTMLFormElement {
  readonly elements: DpsCalcFormElements
}

export type FormValues = {
  [key in FormKeys]?: string
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
export type ItemName = [string, string] | null

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
export type HistoricCalculation = Calculations & { itemName?: ItemName; id: string }
