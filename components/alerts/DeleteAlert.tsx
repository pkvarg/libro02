import React, { useEffect } from 'react'
import { HiOutlineTrash } from 'react-icons/hi2'

interface DeleteAlertProps {
  onDelete: () => void
  onCancel: () => void
  title?: string
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({ onDelete, onCancel, title = 'Naozaj chcete vymazať príspevok?' }) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full rounded-t-2xl bg-surface p-6 shadow-pop animate-in slide-in-from-bottom-4 sm:max-w-sm sm:rounded-2xl"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
            <HiOutlineTrash size={22} />
          </span>
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          <p className="text-sm text-ink-muted">Táto akcia sa nedá vrátiť.</p>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          <button type="button" onClick={onCancel} className="btn btn-secondary flex-1" autoFocus>
            Zrušiť
          </button>
          <button type="button" onClick={onDelete} className="btn btn-danger flex-1">
            Vymazať
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAlert
