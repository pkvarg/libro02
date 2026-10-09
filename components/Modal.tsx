'use client'
import { useCallback, useEffect } from 'react'
import { HiXMark } from 'react-icons/hi2'
import Button from './Button'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  onSubmit?: () => void
  title?: string
  body?: React.ReactElement
  footer?: React.ReactElement
  actionLabel?: string
  disabled?: boolean | undefined
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
}) => {
  const handleClose = useCallback(() => {
    if (disabled) {
      return
    }

    onClose()
  }, [onClose, disabled])

  const handleSubmit = useCallback(() => {
    if (disabled || !onSubmit) {
      return
    }

    onSubmit()
  }, [onSubmit, disabled])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, handleClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-in fade-in" onClick={handleClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          flex-col
          rounded-t-2xl
          bg-surface
          shadow-pop
          animate-in
          slide-in-from-bottom-4
          sm:max-w-lg
          sm:rounded-2xl
        "
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button type="button" onClick={handleClose} className="icon-btn -mr-2" aria-label="Zavrieť">
            <HiXMark size={22} />
          </button>
        </div>
        <div
          className="flex-auto overflow-y-auto px-6 py-5"
          onKeyDown={(event) => {
            // Enter in a text field submits, like a regular form.
            if (event.key === 'Enter' && (event.target as HTMLElement).tagName === 'INPUT') {
              event.preventDefault()
              handleSubmit()
            }
          }}
        >
          {body}
        </div>
        {(actionLabel || footer) && (
          <div className="flex flex-col gap-3 border-t border-line px-6 py-4">
            {actionLabel && (
              <Button disabled={disabled} label={actionLabel} fullWidth large onClick={handleSubmit} />
            )}
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
