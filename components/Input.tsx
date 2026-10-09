import { useId } from 'react'

interface InputProps {
  placeholder?: string
  value?: string
  checked?: boolean
  type?: string
  disabled?: boolean | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  autoComplete?: string
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  type = 'text',
  onChange,
  disabled,
  label,
  checked,
  autoComplete,
}) => {
  const id = useId()
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        disabled={disabled}
        onChange={onChange}
        value={value ?? ''}
        checked={checked}
        placeholder={placeholder}
        aria-label={label ? undefined : placeholder}
        autoComplete={autoComplete}
        type={type}
        className="input"
      />
    </div>
  )
}

export default Input
