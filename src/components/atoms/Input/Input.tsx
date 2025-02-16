import * as classes from './Input.module.css'

type InputProps = {
  label: string
  id: string
  className?: string
}

const Input = ({
  label,
  id,
  name,
  required,
  className = '',
  ...rest
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>): React.JSX.Element => {
  return (
    <div className={`${classes.container} ${className}`}>
      <label htmlFor={id}>
        {label} {required && <span>*</span>}
      </label>
      <input id={id} name={name || id} {...rest} />
    </div>
  )
}

export default Input
