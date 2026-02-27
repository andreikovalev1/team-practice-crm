import { create } from 'zustand'
import { User } from '@/types/user.types'

interface UserState {
  user: User | null;
  isLoggedIn: boolean
  setLogin: (userData: User) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  
  setLogin: (userData) => set({ user: userData, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}))