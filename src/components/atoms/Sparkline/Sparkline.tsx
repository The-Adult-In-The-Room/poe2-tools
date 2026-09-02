type SparklineProps = {
  data: (number | null)[]
  width?: number
  height?: number
  className?: string
}

const Sparkline = ({ data, width = 80, height = 24, className = '' }: SparklineProps): React.JSX.Element => {
  const validPoints = data.filter((v): v is number => v !== null)

  if (validPoints.length < 2) {
    return <div className={`inline-block ${className}`} data-testid="sparkline-empty" />
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

  const pathData = `M ${points.join(' L ')}`
  const isPositive = validPoints[validPoints.length - 1] >= validPoints[0]
  const strokeColor = isPositive ? '#4ade80' : '#f87171'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} data-testid="sparkline">
      <title>Price trend chart</title>
      <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1.5" />
    </svg>
  )
}

export default Sparkline
