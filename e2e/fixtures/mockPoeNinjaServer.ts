import http from 'node:http'
import { currencyOverviewSchema, leagueArraySchema } from '../../src/api/currency/currencySchemas'
import { currencyCategories } from '../../src/constants/currency'
import type { CurrencyCategory, CurrencyItem, CurrencyLine, CurrencyOverview, League } from '../../src/types'

import { MOCK_POE_NINJA_HOST, MOCK_POE_NINJA_PORT } from './mockPoeNinjaConfig'

const HOST = MOCK_POE_NINJA_HOST
const PORT = MOCK_POE_NINJA_PORT

const leagues: League[] = [
  { id: 'runes-of-aldur', name: 'Runes of Aldur' },
  { id: 'standard', name: 'Standard' },
]

const ITEMS_PER_CATEGORY = 12

const baseNames: Partial<Record<CurrencyCategory, string[]>> = {
  Currency: [
    'Divine Orb',
    'Chaos Orb',
    'Exalted Orb',
    'Orb of Alchemy',
    'Orb of Fusing',
    'Orb of Scouring',
    'Orb of Regret',
    'Vaal Orb',
    "Gemcutter's Prism",
    'Chromatic Orb',
    'Orb of Chance',
    "Jeweller's Orb",
  ],
  Fragments: [
    'Ancient Orb Fragment',
    "Awakener's Orb Fragment",
    'Mirror of Kalandra Fragment',
    'Exalted Shard',
    'Chaos Shard',
    'Regal Shard',
    'Alchemy Shard',
    'Transmutation Shard',
    'Alteration Shard',
    'Vaal Shard',
    "Gemcutter's Shard",
    'Fusing Shard',
  ],
}

function toId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function generateCategoryName(category: CurrencyCategory, index: number): string {
  const names = baseNames[category]
  if (names && index < names.length) return names[index]
  return `${category} ${index + 1}`
}

function generateCategoryItems(category: CurrencyCategory): CurrencyItem[] {
  return Array.from({ length: ITEMS_PER_CATEGORY }, (_, index) => {
    const name = generateCategoryName(category, index)
    return {
      id: toId(name),
      name,
      image: `/gen/image/${toId(name)}.png`,
      category,
      detailsId: `${toId(name)}-details`,
    }
  })
}

function buildRates(category: CurrencyCategory, items: CurrencyItem[]): Record<string, number> {
  if (category === 'Currency') {
    return {
      [items[1].id]: 10,
      [items[2].id]: 20,
      [items[3].id]: 50,
      [items[4].id]: 100,
      [items[5].id]: 200,
    }
  }

  const rates: Record<string, number> = {}
  for (let i = 1; i < Math.min(6, items.length); i++) {
    rates[items[i].id] = 10 ** (i - 1)
  }
  return rates
}

function buildLines(items: CurrencyItem[], rates: Record<string, number>): CurrencyLine[] {
  const primary = items[0].id

  return items.slice(1).map((item, index) => {
    const position = index + 1
    const volumePrimaryValue = (ITEMS_PER_CATEGORY - position + 1) * 1000
    const primaryValue = position <= 3 ? 1 / (position * 10) : 1 / (position * 50)

    return {
      id: item.id,
      primaryValue,
      volumePrimaryValue,
      maxVolumeCurrency: primary,
      maxVolumeRate: rates[item.id] ?? 1,
      sparkline: {
        totalChange: index % 2 === 0 ? (index + 1) * 1.5 : -(index + 1) * 1.2,
        data: [0.1, 0.11, null, 0.12, 0.13],
      },
    }
  })
}

function buildOverview(category: CurrencyCategory): CurrencyOverview {
  const items = generateCategoryItems(category)
  const primary = items[0].id
  const secondary = items[1].id
  const rates = buildRates(category, items)
  const lines = buildLines(items, rates)

  return {
    core: {
      primary,
      secondary,
      rates,
      items,
    },
    lines,
    items,
  }
}

const overviews: Record<CurrencyCategory, CurrencyOverview> = Object.fromEntries(
  currencyCategories.map((category) => [category, buildOverview(category)]),
) as Record<CurrencyCategory, CurrencyOverview>

function validateFixtures(): void {
  const leagueResult = leagueArraySchema.safeParse(leagues)
  if (!leagueResult.success) {
    throw new Error(`Mock leagues fixture failed validation: ${leagueResult.error.message}`)
  }

  for (const category of currencyCategories) {
    const result = currencyOverviewSchema.safeParse(overviews[category])
    if (!result.success) {
      throw new Error(`Mock overview fixture for ${category} failed validation: ${result.error.message}`)
    }
  }
}

function parseQueryParams(url: URL): Record<string, string> {
  const params: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

function isValidCategory(value: string): value is CurrencyCategory {
  return currencyCategories.includes(value as CurrencyCategory)
}

export function createMockPoeNinjaServer(): http.Server {
  validateFixtures()

  let serverRef: http.Server | undefined

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`)

    res.setHeader('Content-Type', 'application/json')

    if (req.method === 'GET' && url.pathname === '/poe2/api/economy/leagues') {
      res.writeHead(200)
      res.end(JSON.stringify(leagues))
      return
    }

    if (req.method === 'GET' && url.pathname === '/poe2/api/economy/exchange/current/overview') {
      const { league, type } = parseQueryParams(url)

      if (!league || !type || !isValidCategory(type)) {
        res.writeHead(400)
        res.end(JSON.stringify({ error: 'Missing or invalid league/type parameters' }))
        return
      }

      if (league === '__error-500') {
        res.writeHead(500)
        res.end(JSON.stringify({ error: 'Mock server error' }))
        return
      }

      if (league === '__error-invalid') {
        res.writeHead(200)
        res.end(JSON.stringify({ invalid: true }))
        return
      }

      res.writeHead(200)
      res.end(JSON.stringify(overviews[type]))
      return
    }

    if (req.method === 'POST' && url.pathname === '/__shutdown') {
      res.writeHead(200)
      res.end(JSON.stringify({ ok: true }))
      serverRef?.close()
      return
    }

    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not found' }))
  })

  serverRef = server
  return server
}

export async function startMockPoeNinjaServer(): Promise<{ server: http.Server; url: string }> {
  const server = createMockPoeNinjaServer()

  return new Promise((resolve, reject) => {
    server.listen(PORT, HOST, () => {
      const address = server.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('Mock server started on an unsupported address type'))
        return
      }
      const url = `http://${HOST}:${address.port}/poe2/api/economy`
      resolve({ server, url })
    })

    server.on('error', reject)
  })
}

export async function stopMockPoeNinjaServer(url: string): Promise<void> {
  await fetch(`${url}/__shutdown`, { method: 'POST' })
}
