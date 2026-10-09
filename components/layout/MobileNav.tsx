import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import clsx from 'clsx'
import {
  HiArrowRightOnRectangle,
  HiOutlineEllipsisHorizontal,
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiPlus,
} from 'react-icons/hi2'

import useCurrentUser from '@/hooks/useCurrentUser'
import useBookModal from '@/hooks/useBookModal'

import Avatar from '../Avatar'
import { getNavItems, isActivePath } from './navItems'

const tabClass = (active: boolean) =>
  clsx(
    'focus-ring relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium',
    active ? 'text-brand' : 'text-ink-muted'
  )

const MobileNav = () => {
  const { data: currentUser } = useCurrentUser()
  const router = useRouter()
  const bookModal = useBookModal()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    setMoreOpen(false)
  }, [router.asPath])

  if (!currentUser) return null

  const all = getNavItems(currentUser)
  const tabs = all.filter((item) => ['Domov', 'Príspevky', 'Chat', 'Notifikácie'].includes(item.label))
  const profileHref = `/users/${currentUser.id}`

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Hlavná navigácia"
      >
        <div className="flex">
          {tabs.map(({ label, href, icon: Icon, alert }) => {
            const active = isActivePath(router.asPath, href)
            return (
              <Link key={label} href={href} className={tabClass(active)} aria-current={active ? 'page' : undefined}>
                <span className="relative">
                  <Icon size={24} />
                  {alert && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-surface" />}
                </span>
                {label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={tabClass(moreOpen || isActivePath(router.asPath, '/users') || isActivePath(router.asPath, '/admin'))}
            aria-haspopup="dialog"
          >
            <HiOutlineEllipsisHorizontal size={24} />
            Viac
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden" role="dialog" aria-modal="true" aria-label="Ďalšie možnosti">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMoreOpen(false)} aria-hidden="true" />
          <div className="relative w-full rounded-t-2xl bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-pop animate-in slide-in-from-bottom-4">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" />
            <Link href={profileHref} className="focus-ring flex items-center gap-3 rounded-xl p-3 hover:bg-sunken">
              <Avatar userId={currentUser.id} src={currentUser.profileImage ?? null} name={currentUser.name} size="md" linked={false} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{currentUser.name}</p>
                <p className="truncate text-sm text-ink-muted">Zobraziť profil</p>
              </div>
            </Link>
            <div className="my-2 h-px bg-line" />
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false)
                bookModal.onOpen()
              }}
              className="focus-ring flex w-full items-center gap-3 rounded-xl p-3 text-left text-ink hover:bg-sunken"
            >
              <HiPlus size={22} className="text-brand" /> Pridať knihu
            </button>
            {all
              .filter((item) => item.label === 'Členovia')
              .map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href} className="focus-ring flex items-center gap-3 rounded-xl p-3 text-ink hover:bg-sunken">
                  <Icon size={22} className="text-ink-muted" /> {label}
                </Link>
              ))}
            {currentUser.isAdmin && (
              <Link href="/admin" className="focus-ring flex items-center gap-3 rounded-xl p-3 text-ink hover:bg-sunken">
                <HiOutlineShieldCheck size={22} className="text-ink-muted" /> Admin
              </Link>
            )}
            <Link href="/rules" className="focus-ring flex items-center gap-3 rounded-xl p-3 text-ink hover:bg-sunken">
              <HiOutlineScale size={22} className="text-ink-muted" /> Pravidlá siete
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="focus-ring flex w-full items-center gap-3 rounded-xl p-3 text-left text-danger hover:bg-danger-soft"
            >
              <HiArrowRightOnRectangle size={22} /> Odhlásiť sa
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNav
