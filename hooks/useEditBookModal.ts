import { create } from 'zustand'

interface EditBookModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useEditBookModal = create<EditBookModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useEditBookModal
