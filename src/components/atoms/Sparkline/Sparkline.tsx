import { useMemo } from 'react'

type SparklineProps = {
  data: (number | null)[]
  width?: number
  height?: number
  className?: string
  title?: string
}

const Sparkline = ({
  data,
  width = 80,
  height = 24,
  className = '',
  title = 'Price trend chart',
}: SparklineProps): React.JSX.Element => {
  const pathData = useMemo(() => {
    const validPoints = data.filter((v): v is number => v !== null)

    if (validPoints.length < 2) {
      return null
    }

    const min = Math.min(...validPoints)
    const max = Math.max(...validPoints)
    const range = max - min || 1
    const step = width / (validPoints.length - 1)

    const points = validPoints.map((value, i) => {
      const x = i * step
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })

    const d = `M ${points.join(' L ')}`
    const isPositive = validPoints[validPoints.length - 1] >= validPoints[0]
    const stroke = isPositive ? '#4ade80' : '#f87171'

    return { d, stroke }
  }, [data, width, height])

  if (!pathData) {
    return <div className={`inline-block ${className}`} data-testid="sparkline-empty" />
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      data-testid="sparkline"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d={pathData.d} fill="none" stroke={pathData.stroke} strokeWidth="1.5" />
    </svg>
  )
}

export default Sparkline
