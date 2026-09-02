import { z } from 'zod'
import { currencyCategories } from '#/constants/currency'

const leagueSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const leagueArraySchema = z.array(leagueSchema)

const currencyItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  category: z.string(),
  detailsId: z.string(),
})

const sparklineDataSchema = z.object({
  totalChange: z.number(),
  data: z.array(z.number().nullable()),
})

const currencyLineSchema = z.object({
  id: z.string(),
  primaryValue: z.number(),
  volumePrimaryValue: z.number(),
  maxVolumeCurrency: z.string(),
  maxVolumeRate: z.number(),
  sparkline: sparklineDataSchema,
})

const currencyCoreSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  rates: z.record(z.string(), z.number()),
  items: z.array(currencyItemSchema),
})

export const currencyOverviewSchema = z.object({
  core: currencyCoreSchema,
  lines: z.array(currencyLineSchema),
  items: z.array(currencyItemSchema),
})

export const currencySearchSchema = z.object({
  league: z.string().min(1, 'League is required'),
  type: z.enum(currencyCategories),
})
