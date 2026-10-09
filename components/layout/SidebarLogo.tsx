import Link from 'next/link'
import { FaBookReader } from 'react-icons/fa'

const SidebarLogo = () => {
  return (
    <Link
      href="/"
      className="focus-ring flex items-center gap-2.5 rounded-full px-3 py-2 text-ink"
      aria-label="Librosophia – domov"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <FaBookReader size={18} />
      </span>
      <span className="hidden font-display text-xl font-semibold lg:inline">Librosophia</span>
    </Link>
  )
}

export default SidebarLogo
