export interface League {
  id: string
  name: string
}

export interface CurrencyItem {
  id: string
  name: string
  image: string | null
  category: string
  detailsId: string
}

export interface SparklineData {
  totalChange: number
  data: (number | null)[]
}

export interface CurrencyLine {
  id: string
  primaryValue: number
  volumePrimaryValue: number
  maxVolumeCurrency: string
  maxVolumeRate: number
  sparkline: SparklineData
}

export interface CurrencyCore {
  primary: string
  secondary: string
  rates: Record<string, number>
  items: CurrencyItem[]
}

export interface CurrencyOverview {
  core: CurrencyCore
  lines: CurrencyLine[]
  items: CurrencyItem[]
}

export interface CurrencyRateRow {
  id: string
  name: string
  image: string | null
  detailsId: string
  primaryValue: number
  volumePrimaryValue: number
  maxVolumeCurrency: string
  maxVolumeRate: number
  sparkline: SparklineData
  category: string
}

export type CurrencyCategory =
  | 'Currency'
  | 'Fragments'
  | 'Abyss'
  | 'UncutGems'
  | 'LineageSupportGems'
  | 'Essences'
  | 'SoulCores'
  | 'Idols'
  | 'Runes'
  | 'Ritual'
  | 'Expedition'
  | 'Delirium'
  | 'Breach'
  | 'Verisium'

export interface CurrencySearch {
  league: string
  type: CurrencyCategory
}

export interface CurrencyLoaderData {
  leagues: League[]
  overview: CurrencyOverview
  league: string
  type: CurrencyCategory
  reference: string
}
