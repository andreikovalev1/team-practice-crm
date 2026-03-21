"use client"

import FloatingSelect from "@/components/FloatingSelect"
import { useSettingsStore } from "@/store/useSettingsStore"

const appearenceOptions = [
  { id: "light", name: "light"},
  { id: "dark", name: "dark"},
]

export default function SettingsPage() {
    const { theme, language, setTheme, setLanguage } = useSettingsStore()

    return(
        <form className="flex justify-center px-4 py-2">
            <FloatingSelect
                className="w-full sm:w-5/6 md:w-3/4 lg:w-1/2"
                label="Appearance"
                options={appearenceOptions}
                value={theme}
                onChange={(value) => setTheme(value as "light" | "dark")}
            />
        </form>
    )
}