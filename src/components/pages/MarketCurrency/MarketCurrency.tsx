import { CategoryTabs, CurrencyTable, LeagueSelector, Typography } from '#/components'
import type { CurrencyLoaderData } from '#/types'

type MarketCurrencyProps = {
  loaderData: CurrencyLoaderData
}

const MarketCurrency = ({ loaderData }: MarketCurrencyProps): React.JSX.Element => {
  const { leagues, overview, league, type } = loaderData

  return (
    <div className="flex flex-col gap-6 px-4" data-testid="market-currency">
      <Typography variant="title">Market Currency Rates</Typography>
      <hr />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <LeagueSelector leagues={leagues} currentLeague={league} currentType={type} />
        <CategoryTabs currentLeague={league} currentType={type} />
      </div>

      {overview.lines.length > 0 ? (
        <CurrencyTable overview={overview} />
      ) : (
        <Typography variant="body">No data available for this selection.</Typography>
      )}
    </div>
  )
}

export default MarketCurrency
