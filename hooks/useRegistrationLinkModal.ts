import { create } from 'zustand'

interface RegistrationLinkModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useRegistrationLinkModal = create<RegistrationLinkModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useRegistrationLinkModal
