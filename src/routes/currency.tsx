import type { ErrorComponentProps } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { fetchCurrencyOverview, fetchLeagues } from '#/api'
import { currencyRouteSearchSchema } from '#/api/currency/currencySchemas'
import { MarketCurrency } from '#/components/pages'
import { pageTitle } from '#/constants/seo'
import type { CurrencyLoaderData } from '#/types'

export const Route = createFileRoute('/currency')({
  validateSearch: currencyRouteSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }): Promise<CurrencyLoaderData> => {
    const leagues = await fetchLeagues()
    const league = deps.league || leagues[0]?.id || 'Standard'
    const type = deps.type || 'Currency'

    const overview = await fetchCurrencyOverview({ data: { league, type } })

    return { leagues, overview, league, type }
  },
  errorComponent: CurrencyError,
  component: CurrencyPage,
  head: () => ({
    meta: [
      {
        title: pageTitle('Market Currency Rates'),
      },
    ],
  }),
})

function CurrencyPage() {
  const loaderData = Route.useLoaderData()
  return <MarketCurrency loaderData={loaderData} />
}

function CurrencyError({ error }: ErrorComponentProps) {
  return (
    <div className="flex flex-col gap-4 p-4" role="alert" aria-live="assertive">
      <h1 className="text-xl font-bold text-light-a0">Failed to load currency market</h1>
      <p className="text-light-a0">
        {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'}
      </p>
    </div>
  )
}
