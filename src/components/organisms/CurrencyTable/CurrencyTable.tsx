import { CurrencyRow } from '#/components/molecules'
import type { CurrencyOverview, CurrencyRateRow } from '#/types'

type CurrencyTableProps = {
  overview: CurrencyOverview
}

const CurrencyTable = ({ overview }: CurrencyTableProps): React.JSX.Element => {
  const primaryItem = overview.core.items.find((item) => item.id === overview.core.primary)
  const primaryName = primaryItem?.name || overview.core.primary
  const primaryImage = primaryItem?.image ?? null

  const rows: CurrencyRateRow[] = overview.lines
    .filter((line) => line.id !== overview.core.primary)
    .map((line) => {
      const item = overview.items.find((i) => i.id === line.id)
      return {
        id: line.id,
        name: item?.name || line.id,
        image: item?.image ?? null,
        detailsId: item?.detailsId || '',
        primaryValue: line.primaryValue,
        volumePrimaryValue: line.volumePrimaryValue,
        maxVolumeCurrency: line.maxVolumeCurrency,
        maxVolumeRate: line.maxVolumeRate,
        sparkline: line.sparkline,
        category: item?.category || '',
      }
    })
    .sort((a, b) => b.volumePrimaryValue - a.volumePrimaryValue)

  return (
    <div className="overflow-x-auto" data-testid="currency-table">
      <table className="w-full text-left table-fixed">
        <thead>
          <tr className="border-b border-surface-a30">
            <th className="py-3 px-4 text-light-a0 font-semibold w-[25%]">Currency</th>
            <th className="py-3 px-4 text-center text-light-a0 font-semibold w-[25%]">Value</th>
            <th className="py-3 px-4 text-right text-light-a0 font-semibold w-[15%]">Volume/hr</th>
            <th className="py-3 px-4 text-right text-light-a0 font-semibold w-[15%]">7d Change</th>
            <th className="py-3 px-4 text-light-a0 font-semibold w-[20%]">Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <CurrencyRow key={row.id} row={row} primaryCurrencyName={primaryName} primaryCurrencyImage={primaryImage} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CurrencyTable
