import * as classes from './Typography.module.css'

type Variant = 'card' | 'title' | 'cardTitle' | 'body' | 'clear' | 'subtitle'
type TypographyProps = {
  variant?: Variant
}

const Typography = ({
  children,
  variant = 'body',
}: React.PropsWithChildren<TypographyProps>): React.JSX.Element => {
  const className = classes[variant]

  return <p className={className}>{children}</p>
}

export default Typography
