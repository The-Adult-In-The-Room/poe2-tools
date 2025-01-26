import * as classes from './Card.module.css'

type CardColors = 'cyan' | 'red' | 'pink' | 'blue' | 'yellow'
export type CardProps = {
  color?: CardColors
}

const colorMap: Record<CardColors, string> = {
  cyan: '#8181ee',
  red: '#920202',
  pink: '#cf168f',
  blue: '#366492',
  yellow: '#edc904',
}

const Card = ({
  children,
  color = 'cyan',
}: React.PropsWithChildren<CardProps>): React.JSX.Element => {
  return (
    <div className={classes.card} style={{ borderColor: colorMap[color] }}>
      {children}
    </div>
  )
}

export default Card
