import { FaExchangeAlt } from 'react-icons/fa'
import { Sparkline } from '#/components/atoms'
import type { CurrencyRateRow } from '#/types'
import { transformImageUrl } from '#/utils'

type CurrencyRowProps = {
  row: CurrencyRateRow
  primaryCurrencyName: string
  primaryCurrencyImage: string
}

const formatNumber = (value: number): string => {
  if (value >= 1000) {
    const k = value / 1000
    return k % 1 === 0 ? `${k}.0k` : `${k.toFixed(1)}k`
  }
  if (value >= 10) {
    const rounded = Math.round(value)
    return rounded === value ? `${rounded}.0` : value.toFixed(2).replace(/0+$/, '')
  }
  if (value % 1 === 0) return `${value}.0`
  return value.toFixed(2).replace(/0+$/, '')
}

const formatRatio = (primaryValue: number): { left: string; right: string } => {
  if (primaryValue >= 1) {
    return { left: formatNumber(primaryValue), right: formatNumber(1) }
  }
  const inverse = 1 / primaryValue
  return { left: formatNumber(1), right: formatNumber(inverse) }
}

const formatValue = (value: number): string => {
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (value >= 1) return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(4)
  return value.toFixed(6)
}

const CurrencyRow = ({ row, primaryCurrencyName, primaryCurrencyImage }: CurrencyRowProps): React.JSX.Element => {
  const changeColor = row.sparkline.totalChange >= 0 ? 'text-green-400' : 'text-red-400'
  const changeSign = row.sparkline.totalChange >= 0 ? '+' : ''
  const { left, right } = formatRatio(row.primaryValue)

  return (
    <tr className="border-b border-surface-a30 hover:bg-surface-a20/50" data-testid="currency-row">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={transformImageUrl(row.image)} alt={row.name} className="w-8 h-8" loading="lazy" />
          <span className="text-light-a0 font-medium">{row.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-light-a0">
        <div className="flex items-center justify-center gap-1">
          <span className="w-12 text-right">{left}</span>
          <img
            src={transformImageUrl(primaryCurrencyImage)}
            alt={primaryCurrencyName}
            title={primaryCurrencyName}
            className="w-6 h-6"
            loading="lazy"
          />
          <FaExchangeAlt data-testid="exchange-icon" className="text-[#a1bc98] w-4 h-4 mx-1" />
          <span className="w-12 text-right">{right}</span>
          <img src={transformImageUrl(row.image)} alt={row.name} title={row.name} className="w-6 h-6" loading="lazy" />
        </div>
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
