import { createServerFn } from '@tanstack/react-start'
import type { z } from 'zod'
import { POE_NINJA_BASE_DEFAULT } from '#/constants/poeNinja'
import type { CurrencyOverview, League } from '#/types'
import { currencyOverviewSchema, currencySearchSchema, leagueArraySchema } from './currencySchemas'

function getPoeNinjaBase(): string {
  return process.env.POE_NINJA_BASE ?? POE_NINJA_BASE_DEFAULT
}

export const USER_AGENT = 'poe2-tools (https://github.com/The-Adult-In-The-Room/poe2-tools)'
export const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_MAX_SIZE = 50

interface CacheEntry<T> {
  data: T
  timestamp: number
  lastAccessed: number
}

class BoundedTtlCache {
  #cache = new Map<string, CacheEntry<unknown>>()

  constructor(
    private readonly maxSize: number,
    private readonly ttlMs: number,
  ) {}

  get<T>(key: string): T | undefined {
    const entry = this.#cache.get(key)
    if (!entry) return undefined

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.#cache.delete(key)
      return undefined
    }

    entry.lastAccessed = Date.now()
    return entry.data as T
  }

  set<T>(key: string, data: T): void {
    const now = Date.now()
    this.#cache.set(key, { data, timestamp: now, lastAccessed: now })
    this.#evictIfNeeded()
  }

  clear(): void {
    this.#cache.clear()
  }

  #evictIfNeeded(): void {
    while (this.#cache.size > this.maxSize) {
      let oldestKey = ''
      let oldestTime = Number.POSITIVE_INFINITY

      for (const [key, entry] of this.#cache) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed
          oldestKey = key
        }
      }

      this.#cache.delete(oldestKey)
    }
  }
}

const cache = new BoundedTtlCache(CACHE_MAX_SIZE, CACHE_TTL_MS)

export class PoeNinjaNetworkError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PoeNinjaNetworkError'
  }
}

export class PoeNinjaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(message)
    this.name = 'PoeNinjaApiError'
  }
}

export class PoeNinjaParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PoeNinjaParseError'
  }
}

export class PoeNinjaValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: ReadonlyArray<z.core.$ZodIssue>,
  ) {
    super(message)
    this.name = 'PoeNinjaValidationError'
  }
}

async function fetchFromPoeNinja<T>(url: string, cacheKey: string, schema: z.ZodType<T>): Promise<T> {
  const cached = cache.get<T>(cacheKey)
  if (cached !== undefined) return cached

  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })
  } catch (error) {
    throw new PoeNinjaNetworkError(
      `Failed to reach poe.ninja: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { cause: error },
    )
  }

  if (!response.ok) {
    throw new PoeNinjaApiError(
      `poe.ninja API error: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
    )
  }

  let rawData: unknown
  try {
    rawData = await response.json()
  } catch (error) {
    throw new PoeNinjaParseError(
      `Invalid JSON from poe.ninja: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { cause: error },
    )
  }

  const result = schema.safeParse(rawData)
  if (!result.success) {
    throw new PoeNinjaValidationError('poe.ninja response failed validation', result.error.issues)
  }

  cache.set(cacheKey, result.data)
  return result.data
}

export async function fetchLeaguesHandler(): Promise<League[]> {
  return fetchFromPoeNinja<League[]>(`${getPoeNinjaBase()}/leagues`, 'leagues', leagueArraySchema)
}

export async function fetchCurrencyOverviewHandler(ctx: {
  data: z.infer<typeof currencySearchSchema>
}): Promise<CurrencyOverview> {
  const { league, type } = ctx.data
  const url = `${getPoeNinjaBase()}/exchange/current/overview?league=${encodeURIComponent(league)}&type=${type}`
  const cacheKey = `overview:${league}:${type}`
  return fetchFromPoeNinja<CurrencyOverview>(url, cacheKey, currencyOverviewSchema)
}

export const fetchLeagues = createServerFn({ method: 'GET' }).handler(fetchLeaguesHandler)

export const fetchCurrencyOverview = createServerFn({ method: 'GET' })
  .validator(currencySearchSchema)
  .handler(fetchCurrencyOverviewHandler)

/**
 * Clears the internal API response cache. Intended for tests only.
 */
export function clearCache(): void {
  cache.clear()
}
