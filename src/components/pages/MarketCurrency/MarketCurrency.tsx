import { useState } from 'react'
import { CategoryTabs, CurrencyTable, LeagueSelector, Typography } from '#/components'
import type { CurrencyLoaderData } from '#/types'

type MarketCurrencyProps = {
  loaderData: CurrencyLoaderData
}

const REFERENCE_CURRENCIES = ['divine', 'exalted', 'chaos'] as const

const MarketCurrency = ({ loaderData }: MarketCurrencyProps): React.JSX.Element => {
  const { leagues, overview, league, type } = loaderData
  const [reference, setReference] = useState(overview.core.primary)

  return (
    <div className="flex flex-col gap-6 px-4" data-testid="market-currency">
      <Typography variant="title">Market Currency Rates</Typography>
      <hr />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <LeagueSelector leagues={leagues} currentLeague={league} currentType={type} />
          <select
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="bg-surface-a20 text-light-a0 border border-surface-a30 rounded px-3 py-2 text-sm"
            data-testid="reference-currency-selector"
          >
            {REFERENCE_CURRENCIES.map((currencyId) => {
              const item = overview.core.items.find((i) => i.id === currencyId)
              return (
                <option key={currencyId} value={currencyId}>
                  {item?.name || currencyId}
                </option>
              )
            })}
          </select>
        </div>
        <CategoryTabs currentLeague={league} currentType={type} />
      </div>

      {overview.lines.length > 0 ? (
        <CurrencyTable overview={overview} referenceCurrency={reference} />
      ) : (
        <Typography variant="body">No data available for this selection.</Typography>
      )}
    </div>
  )
}

export default MarketCurrency
