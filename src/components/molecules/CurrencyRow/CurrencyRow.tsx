import { FaExchangeAlt, FaQuestionCircle } from 'react-icons/fa'
import { Sparkline } from '#/components/atoms'
import type { CurrencyRateRow } from '#/types'
import { formatRatio, formatVolume, transformImageUrl } from '#/utils'

type CurrencyRowProps = {
  row: CurrencyRateRow
  primaryCurrencyName: string
  primaryCurrencyImage: string | null
}

const CurrencyRow = ({ row, primaryCurrencyName, primaryCurrencyImage }: CurrencyRowProps): React.JSX.Element => {
  const changeColor = row.sparkline.totalChange >= 0 ? 'text-green-400' : 'text-red-400'
  const changeSign = row.sparkline.totalChange >= 0 ? '+' : ''
  const { left, right } = formatRatio(row.primaryValue)
  const rowImageUrl = transformImageUrl(row.image)
  const primaryImageUrl = transformImageUrl(primaryCurrencyImage)

  return (
    <tr className="border-b border-surface-a30 hover:bg-surface-a20/50" data-testid="currency-row">
      <td className="py-3 px-4 w-[25%]">
        <div className="flex items-center gap-3">
          {rowImageUrl ? (
            <img src={rowImageUrl} alt={row.name} className="w-8 h-8" loading="lazy" />
          ) : (
            <FaQuestionCircle data-testid="question-icon" className="w-8 h-8 text-gray-500" />
          )}
          <span className="text-light-a0 font-medium">{row.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-light-a0 w-[25%]">
        <div className="flex items-center justify-center gap-1">
          <span className="w-12 text-right">{left}</span>
          {primaryImageUrl ? (
            <img
              src={primaryImageUrl}
              alt={primaryCurrencyName}
              title={primaryCurrencyName}
              className="w-6 h-6"
              loading="lazy"
            />
          ) : (
            <FaQuestionCircle data-testid="question-icon" className="w-6 h-6 text-gray-500" />
          )}
          <FaExchangeAlt data-testid="exchange-icon" className="text-[#a1bc98] w-4 h-4 mx-1" />
          <span className="w-12 text-right">{right}</span>
          {rowImageUrl ? (
            <img src={rowImageUrl} alt={row.name} title={row.name} className="w-6 h-6" loading="lazy" />
          ) : (
            <FaQuestionCircle data-testid="question-icon" className="w-6 h-6 text-gray-500" />
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-right text-light-a0 w-[15%]">{formatVolume(row.volumePrimaryValue)}</td>
      <td className="py-3 px-4 text-right w-[15%]">
        <span className={changeColor}>
          {changeSign}
          {row.sparkline.totalChange.toFixed(2)}%
        </span>
      </td>
      <td className="py-3 px-4 w-[20%]">
        <Sparkline data={row.sparkline.data} />
      </td>
    </tr>
  )
}

export default CurrencyRow
