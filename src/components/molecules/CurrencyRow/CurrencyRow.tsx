import { Sparkline } from '#/components/atoms'
import type { CurrencyRateRow } from '#/types'
import { transformImageUrl } from '#/utils'

type CurrencyRowProps = {
  row: CurrencyRateRow
  primaryCurrencyName: string
}

const formatValue = (value: number): string => {
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (value >= 1) return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(4)
  return value.toFixed(6)
}

const CurrencyRow = ({ row, primaryCurrencyName }: CurrencyRowProps): React.JSX.Element => {
  const changeColor = row.sparkline.totalChange >= 0 ? 'text-green-400' : 'text-red-400'
  const changeSign = row.sparkline.totalChange >= 0 ? '+' : ''

  return (
    <tr className="border-b border-surface-a30 hover:bg-surface-a20/50" data-testid="currency-row">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={transformImageUrl(row.image)} alt={row.name} className="w-8 h-8" loading="lazy" />
          <span className="text-light-a0 font-medium">{row.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right text-light-a0">
        {formatValue(row.primaryValue)} {primaryCurrencyName}
      </td>
      <td className="py-3 px-4 text-right text-light-a0">{formatValue(row.volumePrimaryValue)}</td>
      <td className="py-3 px-4 text-right">
        <span className={changeColor}>
          {changeSign}
          {row.sparkline.totalChange.toFixed(2)}%
        </span>
      </td>
      <td className="py-3 px-4">
        <Sparkline data={row.sparkline.data} />
      </td>
    </tr>
  )
}

export default CurrencyRow
