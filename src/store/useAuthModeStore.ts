import { create } from 'zustand'

export type AuthMode = "login" | "register" | "reset"

interface AuthModeState {
    mode: AuthMode,
    setMode: (mode: AuthMode) => void
}

export const useAuthModeStore = create<AuthModeState>((set) => ({
    mode: 'login',
    setMode: (mode) => set({ mode }),
}))