import type { CardColors } from '../../../types'
import * as classes from './Card.module.css'

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
  ...rest
}: React.PropsWithChildren<CardProps & React.HTMLAttributes<HTMLDivElement>>): React.JSX.Element => {
  return (
    <div className={classes.card} style={{ borderColor: colorMap[color] }} {...rest}>
      {children}
    </div>
  )
}

export default Card
