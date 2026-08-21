import { createServerFn } from '@tanstack/react-start'
import type { CurrencyCategory, CurrencyOverview, League } from '#/types'

const POE_NINJA_BASE = 'https://poe.ninja/poe2/api/economy'
const USER_AGENT = 'poe2-tools (https://github.com/The-Adult-In-The-Room/poe2-tools)'
const CACHE_TTL_MS = 5 * 60 * 1000

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.data
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function fetchFromPoeNinja<T>(url: string, cacheKey: string): Promise<T> {
  const cached = getCached<T>(cacheKey)
  if (cached) return cached

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) {
    throw new Error(`poe.ninja API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as T
  setCache(cacheKey, data)
  return data
}

export const fetchLeagues = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchFromPoeNinja<League[]>(`${POE_NINJA_BASE}/leagues`, 'leagues')
})

export const fetchCurrencyOverview = createServerFn({ method: 'GET' })
  .validator((input: { league: string; type: CurrencyCategory }) => input)
  .handler(async ({ data }) => {
    const { league, type } = data
    const url = `${POE_NINJA_BASE}/exchange/current/overview?league=${encodeURIComponent(league)}&type=${type}`
    const cacheKey = `overview:${league}:${type}`
    return fetchFromPoeNinja<CurrencyOverview>(url, cacheKey)
  })
