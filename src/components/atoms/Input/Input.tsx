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
    <div data-testid="input-container" className={`flex flex-col ${className}`}>
      <label htmlFor={id}>
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input id={id} name={name || id} {...rest} />
    </div>
  )
}

export default Input
