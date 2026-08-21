import { createFileRoute } from '@tanstack/react-router'
import { fetchCurrencyOverview, fetchLeagues } from '#/api'
import { MarketCurrency } from '#/components/pages'
import type { CurrencyCategory, CurrencyLoaderData } from '#/types'

const currencySearchSchema = (search: Record<string, unknown>) => ({
  league: (search.league as string) || '',
  type: (search.type as CurrencyCategory) || 'Currency',
  reference: (search.reference as string) || '',
})

export const Route = createFileRoute('/currency')({
  validateSearch: currencySearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }): Promise<CurrencyLoaderData> => {
    const leagues = await fetchLeagues()
    const league = deps.league || leagues[0]?.id || 'Standard'
    const type = deps.type || 'Currency'

    const overview = await fetchCurrencyOverview({ data: { league, type } })

    const reference = deps.reference || overview.core.primary

    return { leagues, overview, league, type, reference }
  },
  component: CurrencyPage,
})

function CurrencyPage() {
  const loaderData = Route.useLoaderData()
  return <MarketCurrency loaderData={loaderData} />
}
