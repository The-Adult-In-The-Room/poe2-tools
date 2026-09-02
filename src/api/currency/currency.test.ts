import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CACHE_TTL_MS,
  clearCache,
  fetchCurrencyOverviewHandler,
  fetchLeaguesHandler,
  PoeNinjaApiError,
  PoeNinjaNetworkError,
  PoeNinjaParseError,
  PoeNinjaValidationError,
} from './currency'
import { currencySearchSchema } from './currencySchemas'

const mockFetch = vi.fn()

const validLeagues = [
  { id: 'standard', name: 'Standard' },
  { id: 'hardcore', name: 'Hardcore' },
]

const validOverview = {
  core: {
    primary: 'Chaos Orb',
    secondary: 'Divine Orb',
    rates: { chaos: 1, divine: 0.01 },
    items: [
      {
        id: 'chaos',
        name: 'Chaos Orb',
        image: '/image.png',
        category: 'Currency',
        detailsId: 'chaos-orb',
      },
    ],
  },
  lines: [
    {
      id: 'divine',
      primaryValue: 100,
      volumePrimaryValue: 5000,
      maxVolumeCurrency: 'chaos',
      maxVolumeRate: 100,
      sparkline: {
        totalChange: 5,
        data: [1, 2, null],
      },
    },
  ],
  items: [
    {
      id: 'divine',
      name: 'Divine Orb',
      image: '/image.png',
      category: 'Currency',
      detailsId: 'divine-orb',
    },
  ],
}

beforeEach(() => {
  clearCache()
  mockFetch.mockClear()
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('fetchLeaguesHandler', () => {
  it('fetches and parses leagues from poe.ninja', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validLeagues,
    })

    const result = await fetchLeaguesHandler()

    expect(result).toEqual(validLeagues)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://poe.ninja/poe2/api/economy/leagues',
      expect.objectContaining({
        headers: expect.objectContaining({ 'User-Agent': expect.stringContaining('poe2-tools') }),
      }),
    )
  })

  it('uses POE_NINJA_BASE env override when set', async () => {
    vi.stubEnv('POE_NINJA_BASE', 'http://localhost:9999')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validLeagues,
    })

    const result = await fetchLeaguesHandler()

    expect(result).toEqual(validLeagues)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:9999/leagues',
      expect.objectContaining({
        headers: expect.objectContaining({ 'User-Agent': expect.stringContaining('poe2-tools') }),
      }),
    )
  })

  it('returns cached leagues on subsequent calls', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validLeagues,
    })

    await fetchLeaguesHandler()
    const result = await fetchLeaguesHandler()

    expect(result).toEqual(validLeagues)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('throws PoeNinjaNetworkError when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'))

    await expect(fetchLeaguesHandler()).rejects.toBeInstanceOf(PoeNinjaNetworkError)
  })

  it('throws PoeNinjaNetworkError for non-Error fetch failures', async () => {
    mockFetch.mockRejectedValueOnce('fetch failed')

    await expect(fetchLeaguesHandler()).rejects.toBeInstanceOf(PoeNinjaNetworkError)
  })

  it('throws PoeNinjaApiError for non-OK responses', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Service Unavailable' })

    await expect(fetchLeaguesHandler()).rejects.toBeInstanceOf(PoeNinjaApiError)
  })

  it('throws PoeNinjaParseError for invalid JSON', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => JSON.parse('not json') })

    await expect(fetchLeaguesHandler()).rejects.toBeInstanceOf(PoeNinjaParseError)
  })

  it('throws PoeNinjaParseError for non-Error JSON failures', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw 'json failed'
      },
    })

    await expect(fetchLeaguesHandler()).rejects.toBeInstanceOf(PoeNinjaParseError)
  })

  it('throws PoeNinjaValidationError for malformed data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 'standard' }],
    })

    await expect(fetchLeaguesHandler()).rejects.toBeInstanceOf(PoeNinjaValidationError)
  })
})

describe('fetchCurrencyOverviewHandler', () => {
  it('fetches and parses currency overview', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validOverview,
    })

    const result = await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })

    expect(result).toEqual(validOverview)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://poe.ninja/poe2/api/economy/exchange/current/overview?league=Standard&type=Currency',
      expect.any(Object),
    )
  })

  it('uses POE_NINJA_BASE env override when set', async () => {
    vi.stubEnv('POE_NINJA_BASE', 'http://localhost:9999')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validOverview,
    })

    const result = await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })

    expect(result).toEqual(validOverview)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:9999/exchange/current/overview?league=Standard&type=Currency',
      expect.any(Object),
    )
  })

  it('caches responses by league and type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validOverview,
    })

    await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })
    const result = await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })

    expect(result).toEqual(validOverview)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does not share cache across leagues', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validOverview,
    })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...validOverview, core: { ...validOverview.core, primary: 'Other' } }),
    })

    await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })
    await fetchCurrencyOverviewHandler({ data: { league: 'Hardcore', type: 'Currency' } })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('refetches after the cache TTL expires', async () => {
    vi.useFakeTimers()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validOverview,
    })

    await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })

    vi.advanceTimersByTime(CACHE_TTL_MS + 1)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => validOverview,
    })

    await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('evicts oldest cached entries when max size is exceeded', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => validOverview,
    })

    for (let i = 0; i < 51; i++) {
      await fetchCurrencyOverviewHandler({
        data: { league: `league-${i}`, type: 'Currency' },
      })
    }

    expect(mockFetch).toHaveBeenCalledTimes(51)

    await fetchCurrencyOverviewHandler({ data: { league: 'league-0', type: 'Currency' } })

    expect(mockFetch).toHaveBeenCalledTimes(52)
  })

  it('throws PoeNinjaValidationError for invalid overview shapes', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ core: { primary: 'Chaos Orb' } }),
    })

    await expect(
      fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } }),
    ).rejects.toBeInstanceOf(PoeNinjaValidationError)
  })

  it('accepts items with an undefined image field', async () => {
    const overviewWithMissingImage = {
      ...validOverview,
      items: [{ ...validOverview.items[0], image: undefined }],
      core: {
        ...validOverview.core,
        items: [{ ...validOverview.core.items[0], image: undefined }],
      },
    }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => overviewWithMissingImage,
    })

    const result = await fetchCurrencyOverviewHandler({ data: { league: 'Standard', type: 'Currency' } })

    expect(result.core.items[0].image).toBeNull()
    expect(result.items[0].image).toBeNull()
  })
})

describe('currencySearchSchema', () => {
  it('accepts valid league and category', () => {
    expect(currencySearchSchema.parse({ league: 'Standard', type: 'Currency' })).toEqual({
      league: 'Standard',
      type: 'Currency',
    })
  })

  it('rejects an empty league', () => {
    expect(() => currencySearchSchema.parse({ league: '', type: 'Currency' })).toThrow()
  })

  it('rejects an invalid category', () => {
    expect(() => currencySearchSchema.parse({ league: 'Standard', type: 'NotACategory' })).toThrow()
  })

  it('rejects missing fields', () => {
    expect(() => currencySearchSchema.parse({ league: 'Standard' })).toThrow()
  })
})
