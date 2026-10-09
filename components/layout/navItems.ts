import { IconType } from 'react-icons'
import {
  HiOutlineBell,
  HiOutlineHome,
  HiOutlineChatBubbleLeftRight,
  HiOutlineNewspaper,
  HiOutlineUser,
  HiOutlineUserGroup,
} from 'react-icons/hi2'

export interface NavItem {
  label: string
  href: string
  icon: IconType
  auth?: boolean
  alert?: boolean
}

// '/users' is the member list; profiles live under it, so it matches only exactly.
export const isActivePath = (asPath: string, href: string) => {
  const path = asPath.split(/[?#]/)[0]
  if (href === '/' || href === '/users') return path === href
  return path === href || path.startsWith(`${href}/`)
}

export const getNavItems = (currentUser?: Record<string, any>): NavItem[] => [
  { label: 'Domov', href: '/', icon: HiOutlineHome },
  { label: 'Príspevky', href: '/posts', icon: HiOutlineNewspaper, auth: true },
  { label: 'Chat', href: '/conversations', icon: HiOutlineChatBubbleLeftRight, auth: true },
  {
    label: 'Notifikácie',
    href: '/notifications',
    icon: HiOutlineBell,
    auth: true,
    alert: !!currentUser?.hasNotification,
  },
  { label: 'Členovia', href: '/users', icon: HiOutlineUserGroup, auth: true },
  { label: 'Profil', href: `/users/${currentUser?.id}`, icon: HiOutlineUser, auth: true },
]
