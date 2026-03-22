import { create } from "zustand"

interface ModalState {
  isProjectCreateOpen: boolean
  openProjectCreate: () => void
  closeProjectCreate: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isProjectCreateOpen: false,
  openProjectCreate: () => set({ isProjectCreateOpen: true }),
  closeProjectCreate: () => set({ isProjectCreateOpen: false }),
}))