import http from 'node:http'
import { currencyOverviewSchema, leagueArraySchema } from '../../src/api/currency/currencySchemas'
import { currencyCategories } from '../../src/constants/currency'
import type { CurrencyCategory, CurrencyOverview, League } from '../../src/types'

import { MOCK_POE_NINJA_HOST, MOCK_POE_NINJA_PORT } from './mockPoeNinjaConfig'

const HOST = MOCK_POE_NINJA_HOST
const PORT = MOCK_POE_NINJA_PORT

const leagues: League[] = [
  { id: 'runes-of-aldur', name: 'Runes of Aldur' },
  { id: 'standard', name: 'Standard' },
]

const categoryItems: Record<CurrencyCategory, { id: string; name: string; image: string | null }[]> = {
  Currency: [
    { id: 'divine', name: 'Divine Orb', image: '/gen/image/divine.png' },
    { id: 'exalted', name: 'Exalted Orb', image: '/gen/image/exalted.png' },
    { id: 'chaos', name: 'Chaos Orb', image: '/gen/image/chaos.png' },
  ],
  Fragments: [
    { id: 'ancient-orb-fragment', name: 'Ancient Orb Fragment', image: '/gen/image/ancient.png' },
    { id: 'awakeners-orb-fragment', name: "Awakener's Orb Fragment", image: '/gen/image/awakener.png' },
  ],
  Abyss: [{ id: 'abyssal-jewel', name: 'Abyssal Jewel', image: '/gen/image/abyssal.png' }],
  UncutGems: [
    { id: 'uncut-spirit-gem', name: 'Uncut Spirit Gem', image: '/gen/image/spirit.png' },
    { id: 'uncut-skill-gem', name: 'Uncut Skill Gem', image: '/gen/image/skill.png' },
  ],
  LineageSupportGems: [{ id: 'lineage-support-gem', name: 'Lineage Support Gem', image: '/gen/image/lineage.png' }],
  Essences: [
    { id: 'screaming-essence', name: 'Screaming Essence of Anger', image: '/gen/image/screaming.png' },
    { id: 'shrieking-essence', name: 'Shrieking Essence of Anger', image: '/gen/image/shrieking.png' },
  ],
  SoulCores: [
    { id: 'soul-core-of-talamt', name: 'Soul Core of Talamt', image: '/gen/image/talamt.png' },
    { id: 'soul-core-of-cholotl', name: 'Soul Core of Cholotl', image: '/gen/image/cholotl.png' },
  ],
  Idols: [
    { id: 'small-idol', name: 'Small Idol', image: '/gen/image/small-idol.png' },
    { id: 'medium-idol', name: 'Medium Idol', image: '/gen/image/medium-idol.png' },
  ],
  Runes: [
    { id: 'rune-of-imbuement', name: 'Rune of Imbuement', image: '/gen/image/imbuement.png' },
    { id: 'rune-of-resonation', name: 'Rune of Resonation', image: '/gen/image/resonation.png' },
  ],
  Ritual: [{ id: 'ritual-vessel', name: 'Ritual Vessel', image: '/gen/image/vessel.png' }],
  Expedition: [{ id: 'exotic-coinage', name: 'Exotic Coinage', image: '/gen/image/coinage.png' }],
  Delirium: [{ id: 'delirious-orb', name: 'Delirious Orb', image: '/gen/image/delirious.png' }],
  Breach: [{ id: 'breach-splinter', name: 'Breach Splinter', image: '/gen/image/splinter.png' }],
  Verisium: [{ id: 'verisium-bar', name: 'Verisium Bar', image: '/gen/image/verisium.png' }],
}

function buildOverview(category: CurrencyCategory): CurrencyOverview {
  const items = categoryItems[category].map((item) => ({
    ...item,
    category,
    detailsId: `${item.id}-details`,
  }))

  const primary = items[0]?.id ?? 'divine'
  const secondary = items[1]?.id ?? primary

  const rates: Record<string, number> = {}
  if (secondary !== primary) {
    rates[secondary] = category === 'Currency' ? 150 : 10
  }

  const lines = items.slice(1).map((item, index) => ({
    id: item.id,
    primaryValue: (index + 1) * 0.1,
    volumePrimaryValue: (index + 1) * 1000,
    maxVolumeCurrency: primary,
    maxVolumeRate: rates[item.id] ?? 1,
    sparkline: {
      totalChange: index % 2 === 0 ? 5.5 : -3.2,
      data: [0.1, 0.11, 0.12, null, 0.13],
    },
  }))

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
