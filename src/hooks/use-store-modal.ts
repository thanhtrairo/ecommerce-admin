import { create } from 'zustand'

type useStoreModal = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useStoreModal = create<useStoreModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
