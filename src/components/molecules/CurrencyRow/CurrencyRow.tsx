import { memo, useMemo } from 'react'
import { FaExchangeAlt, FaQuestionCircle } from 'react-icons/fa'
import { Sparkline } from '#/components/atoms'
import type { CurrencyRateRow } from '#/types'
import { formatRatio, formatVolume, transformImageUrl } from '#/utils'

type CurrencyRowProps = {
  row: CurrencyRateRow
  primaryCurrencyName: string
  primaryCurrencyImage: string | null
}

type FallbackIconProps = {
  size: 'sm' | 'md'
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
} as const

const FallbackIcon = ({ size }: FallbackIconProps): React.JSX.Element => (
  <FaQuestionCircle data-testid="question-icon" className={`${sizeClasses[size]} text-gray-500`} />
)

const CurrencyRow = ({ row, primaryCurrencyName, primaryCurrencyImage }: CurrencyRowProps): React.JSX.Element => {
  const { changeColor, left, right, rowImageUrl, primaryImageUrl, volume, changeText } = useMemo(() => {
    const changeColor = row.sparkline.totalChange >= 0 ? 'text-green-400' : 'text-red-400'
    const changeSign = row.sparkline.totalChange >= 0 ? '+' : ''
    const { left, right } = formatRatio(row.primaryValue)
    return {
      changeColor,
      left,
      right,
      rowImageUrl: transformImageUrl(row.image),
      primaryImageUrl: transformImageUrl(primaryCurrencyImage),
      volume: formatVolume(row.volumePrimaryValue),
      changeText: `${changeSign}${row.sparkline.totalChange.toFixed(2)}%`,
    }
  }, [row, primaryCurrencyImage])

  return (
    <tr className="border-b border-surface-a30 hover:bg-surface-a20/50" data-testid="currency-row">
      <td className="py-3 px-4 w-[25%]">
        <div className="flex items-center gap-3">
          {rowImageUrl ? (
            <img src={rowImageUrl} alt={row.name} className="w-8 h-8" loading="lazy" />
          ) : (
            <FallbackIcon size="md" />
          )}
          <span className="text-light-a0 font-medium">{row.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-light-a0 w-[25%]">
        <div className="flex items-center justify-center gap-1">
          <span data-testid="currency-value-left" className="w-12 text-right">
            {left}
          </span>
          {primaryImageUrl ? (
            <img
              src={primaryImageUrl}
              alt={primaryCurrencyName}
              title={primaryCurrencyName}
              className="w-6 h-6"
              loading="lazy"
            />
          ) : (
            <FallbackIcon size="sm" />
          )}
          <FaExchangeAlt data-testid="exchange-icon" className="text-[#a1bc98] w-4 h-4 mx-1" />
          <span data-testid="currency-value-right" className="w-12 text-right">
            {right}
          </span>
          {rowImageUrl ? (
            <img src={rowImageUrl} alt={row.name} title={row.name} className="w-6 h-6" loading="lazy" />
          ) : (
            <FallbackIcon size="sm" />
          )}
        </div>
      </td>
      <td data-testid="currency-volume" className="py-3 px-4 text-right text-light-a0 w-[15%]">
        {volume}
      </td>
      <td className="py-3 px-4 text-right w-[15%]">
        <span data-testid="currency-change" className={changeColor}>
          {changeText}
        </span>
      </td>
      <td className="py-3 px-4 w-[20%]">
        <Sparkline data={row.sparkline.data} title={`${row.name} price trend`} />
      </td>
    </tr>
  )
}

export default memo(CurrencyRow)
