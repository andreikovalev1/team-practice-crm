"use client"

import { IoIosSearch } from "react-icons/io"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}: SearchInputProps) {
  return (
    <div
      className={`w-full max-w-[220px] h-10 rounded-[40px] 
                  border border-gray-300 bg-white dark:border-white dark:bg-[#353535] 
                  flex items-center px-4 ${className}`}
    >
      <IoIosSearch className="text-zinc-400 dark:text-gray-300 mr-2" size={18} />

      <Input
        className="bg-transparent border-0 shadow-none focus:ring-0 focus:outline-none p-0 h-full w-full text-gray-900 dark:text-gray-100
                  dark:bg-transparent "
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}