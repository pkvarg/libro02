import { create } from 'zustand'

interface MyBookModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useMyBookModal = create<MyBookModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useMyBookModal
