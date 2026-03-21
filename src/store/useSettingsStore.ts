import { create } from "zustand"

type Theme = "light" | "dark"
type Language = "en" | "ru"

interface SettingsState {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (lang: Language) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "light",
  language: "en",
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}))