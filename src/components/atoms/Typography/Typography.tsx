type Variant = 'card' | 'title' | 'cardTitle' | 'body' | 'clear' | 'subtitle'
type TypographyProps = {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  card: 'text-[28px] font-medium',
  title: 'text-2xl font-bold',
  cardTitle: 'text-lg font-medium',
  body: 'text-base font-normal',
  clear: 'text-base font-normal underline',
  subtitle: 'text-sm font-light',
}

const Typography = ({ children, variant = 'body' }: React.PropsWithChildren<TypographyProps>): React.JSX.Element => {
  return <p className={variantClasses[variant]}>{children}</p>
}

export default Typography
