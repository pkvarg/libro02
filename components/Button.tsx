import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
  label: string
  secondary?: boolean
  fullWidth?: boolean
  large?: boolean
  small?: boolean
  onClick: () => void
  disabled?: boolean
  outline?: boolean
  danger?: boolean
  type?: 'button' | 'submit'
  icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  label,
  secondary,
  fullWidth,
  large,
  small,
  onClick,
  disabled,
  outline,
  danger,
  type = 'button',
  icon,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'btn',
        danger ? 'btn-danger' : secondary || outline ? 'btn-secondary' : 'btn-primary',
        large && 'btn-lg',
        small && 'btn-sm',
        fullWidth && 'w-full'
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export default Button
