import { useMemo } from 'react'
import { CurrencyRow } from '#/components/molecules'
import type { CurrencyOverview, CurrencyRateRow } from '#/types'

type CurrencyTableProps = {
  overview: CurrencyOverview
  referenceCurrency: string
}

const CurrencyTable = ({ overview, referenceCurrency }: CurrencyTableProps): React.JSX.Element => {
  const referenceItem = overview.core.items.find((item) => item.id === referenceCurrency)
  const referenceName = referenceItem?.name || referenceCurrency
  const referenceImage = referenceItem?.image ?? null

  const referenceRate = referenceCurrency === overview.core.primary ? 1 : overview.core.rates[referenceCurrency] || 1

  const rows: CurrencyRateRow[] = useMemo(
    () =>
      overview.lines
        .filter((line) => line.id !== referenceCurrency)
        .map((line) => {
          const item = overview.items.find((i) => i.id === line.id)
          const convertedValue = line.primaryValue * referenceRate
          return {
            id: line.id,
            name: item?.name || line.id,
            image: item?.image ?? null,
            detailsId: item?.detailsId || '',
            primaryValue: convertedValue,
            volumePrimaryValue: line.volumePrimaryValue,
            maxVolumeCurrency: line.maxVolumeCurrency,
            maxVolumeRate: line.maxVolumeRate,
            sparkline: line.sparkline,
            category: item?.category || '',
          }
        })
        .sort((a, b) => b.volumePrimaryValue - a.volumePrimaryValue),
    [overview, referenceCurrency, referenceRate],
  )

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
            <CurrencyRow
              key={row.id}
              row={row}
              primaryCurrencyName={referenceName}
              primaryCurrencyImage={referenceImage}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CurrencyTable
