'use client'
import React, { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiArrowLeft } from 'react-icons/hi2'

interface HeaderProps {
  label: string
  showBackArrow?: boolean
  action?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ label, showBackArrow, action }) => {
  const router = useRouter()

  const handleBack = useCallback(() => {
    // Back within the site when possible, otherwise home.
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }, [router])

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-4 border-b border-line bg-paper/90 px-4 backdrop-blur md:mx-0 md:px-1">
      <div className="flex h-14 items-center gap-2">
        {showBackArrow && (
          <button type="button" onClick={handleBack} className="icon-btn -ml-2" aria-label="Späť">
            <HiArrowLeft size={20} />
          </button>
        )}
        <h1 className="page-title min-w-0 truncate">{label}</h1>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {action}
          <Link href="/rules" className="focus-ring rounded px-1 text-sm text-ink-muted hover:text-ink hover:underline">
            Pravidlá siete
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
