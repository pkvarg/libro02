import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'

const EmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sunken text-ink-muted">
        <HiOutlineChatBubbleLeftRight size={26} />
      </span>
      <h3 className="font-display text-xl font-semibold text-ink">Zvoľte si správu</h3>
    </div>
  )
}

export default EmptyState
